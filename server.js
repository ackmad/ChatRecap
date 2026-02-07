import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Ganti dengan URL frontend production Anda nanti
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// --- REAL DATA STORE ---
// Map untuk menyimpan status setiap user: socket.id => "halaman_saat_ini"
// Contoh data: { 'socket_abc123': 'landing', 'socket_xyz987': 'creating' }
const activeUsers = new Map();

// Fungsi untuk menghitung dan broadcast data terbaru
const broadcastRealtimeStats = () => {
  // 1. Reset hitungan
  const stats = {
    landing: 0,
    creating: 0,
    reading: 0, // Halaman result/summary
    total: 0
  };

  // 2. Loop semua user aktif untuk dikategorikan
  activeUsers.forEach((page) => {
    if (stats[page] !== undefined) {
      stats[page]++;
    }
  });

  // 3. Hitung total koneksi aktif (berdasarkan jumlah keys di Map)
  stats.total = activeUsers.size;

  // 4. Kirim data JUJUR ke semua client yang terhubung
  console.log('📡 Broadcasting Stats:', stats); // Log untuk Anda memantau di terminal server
  io.emit('activity_update', stats);
};

io.on('connection', (socket) => {
  console.log(`➕ New User Connected: ${socket.id}`);

  // Default: Anggap user di landing page saat baru connect (biar langsung kehitung online)
  activeUsers.set(socket.id, 'landing');
  broadcastRealtimeStats();

  // Event 1: User Melapor "Saya sedang di halaman X"
  socket.on('page_view', (pageName) => {
    // Validasi nama halaman agar sesuai kategori stats
    const validPages = ['landing', 'creating', 'reading'];
    const page = validPages.includes(pageName) ? pageName : 'landing';

    // Simpan/Update status user ini
    activeUsers.set(socket.id, page);

    // Langsung update semua orang
    broadcastRealtimeStats();
  });

  // Event 2: User Putus Koneksi (Tutup Tab / Refresh)
  socket.on('disconnect', () => {
    // Hapus user dari data store
    activeUsers.delete(socket.id);

    // Update semua orang bahwa user berkurang
    broadcastRealtimeStats();
  });
});

app.get('/', (req, res) => {
  res.send('🟢 Realtime Analytics Server Running (Pure Data Mode)');
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server siap di port ${PORT}`);
});