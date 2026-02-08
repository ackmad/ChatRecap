import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  onDisconnect, 
  serverTimestamp 
} from 'firebase/database';

// --- TYPES ---
export type PageCategory = 'landing' | 'creating' | 'reading';

export interface GlobalStats {
    landing: number;
    creating: number;
    result: number; // di UI pakai 'result', di logic kita hitung sebagai 'reading'
    total: number;
}

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCxvaTFcEX-Cqi0Ilwupk50sbZpBPu9-pA",
  authDomain: "chatrecap-35849.firebaseapp.com",
  databaseURL: "https://chatrecap-35849-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatrecap-35849",
  storageBucket: "chatrecap-35849.firebasestorage.app",
  messagingSenderId: "802650323219",
  appId: "1:802650323219:web:2a6a8b170c3b5a680202e6"
};

// Initialize Firebase (Hanya sekali di luar hook agar tidak re-init terus menerus)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper: Generate Session ID Unik per Browser
const getSessionId = () => {
  let id = sessionStorage.getItem('visitor_session_id');
  if (!id) {
    // Buat ID acak sederhana
    id = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    sessionStorage.setItem('visitor_session_id', id);
  }
  return id;
};

export const useRoomPresence = (
    _roomId: string | null, // Deprecated: Disimpan biar gak error di file lain
    _userIdentity: any,      // Deprecated
    category: PageCategory = 'landing'
) => {
    // State Statistik Global
    const [globalStats, setGlobalStats] = useState<GlobalStats>({
        landing: 0,
        creating: 0,
        result: 0,
        total: 0
    });

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const userId = getSessionId();
        
        // 1. Referensi Database
        const myStatusRef = ref(db, `status/${userId}`);
        const allStatusRef = ref(db, 'status');
        const connectedRef = ref(db, '.info/connected');

        // 2. Cek Koneksi (Online/Offline)
        const unsubscribeConnection = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                setIsConnected(true);
                
                // Saat konek, simpan data diri
                set(myStatusRef, {
                    page: category,
                    last_seen: serverTimestamp(),
                    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
                });

                // PENTING: Hapus data diri otomatis kalau internet putus/tab tutup
                onDisconnect(myStatusRef).remove();
            } else {
                setIsConnected(false);
            }
        });

        // 3. Update Status Halaman (Jika kategori berubah)
        if (isConnected) {
            set(myStatusRef, {
                page: category,
                last_seen: serverTimestamp(),
                device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
            });
        }

        // 4. Dengarkan Perubahan Data Global (Realtime Counter)
        const unsubscribeStats = onValue(allStatusRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                let l = 0, c = 0, r = 0;

                // Loop semua user aktif dan hitung
                Object.values(data).forEach((user: any) => {
                    if (user.page === 'landing') l++;
                    else if (user.page === 'creating') c++;
                    else if (user.page === 'reading') r++; // 'reading' dianggap 'result'
                });

                setGlobalStats({
                    landing: l,
                    creating: c,
                    result: r,
                    total: l + c + r
                });
            } else {
                // Kalau database kosong (0 user)
                setGlobalStats({ landing: 0, creating: 0, result: 0, total: 0 });
            }
        });

        // Cleanup saat component unmount
        return () => {
            unsubscribeConnection();
            unsubscribeStats();
            // Kita biarkan onDisconnect yang menangani penghapusan data di server
        };

    }, [category]); // Jalankan ulang kalau user pindah halaman (kategori berubah)

    // Return structure yang kompatibel dengan kode UI Anda sebelumnya
    return {
        isConnected,
        presenceState: { roomId: 'global', onlineCount: globalStats.total, users: [] }, // Dummy compliance
        globalStats,
        updateMyStatus: (_status?: string) => { }, // No-op (tidak perlu lagi)
        socket: null // Socket sudah diganti Firebase
    };
};