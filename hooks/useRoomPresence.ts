import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// --- TYPES ---
export type PageCategory = 'landing' | 'creating' | 'reading';

export interface GlobalStats {
    landing: number;
    creating: number;
    result: number; // mapped from 'reading' in server
    total: number;
}

// --- CONFIG ---
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useRoomPresence = (
    _roomId: string | null, // Deprecated but kept for signature compatibility
    _userIdentity: any,      // Deprecated
    category: PageCategory = 'landing'
) => {
    const [globalStats, setGlobalStats] = useState<GlobalStats>({
        landing: 0,
        creating: 0,
        result: 0,
        total: 0
    });

    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // 1. Initialize Connection ONCE
    useEffect(() => {
        // Prevent multiple connections if header re-renders
        if (socketRef.current) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Connected to Analytics Server:', socket.id);
            setIsConnected(true);
            // Emit initial page view upon connection
            socket.emit('page_view', category);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from Analytics Server');
            setIsConnected(false);
        });

        // Listen for global updates
        socket.on('activity_update', (stats: any) => {
            // Map server 'reading' to client 'result' key if needed, or just use as is
            setGlobalStats({
                landing: stats.landing || 0,
                creating: stats.creating || 0,
                result: stats.reading || 0, // Server sends 'reading', Client UI expects 'result'
                total: stats.total || 0
            });
        });

        return () => {
            // Optional: Don't disconnect on unmount to keep connection alive during nav? 
            // But for safer cleanup:
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    // 2. Handle Page Navigation (Category Change)
    useEffect(() => {
        if (socketRef.current && isConnected) {
            console.log('📍 Page View:', category);
            socketRef.current.emit('page_view', category);
        }
    }, [category, isConnected]);

    // Return structure compatible with previous hook where reasonable
    return {
        isConnected,
        presenceState: { roomId: 'global', onlineCount: globalStats.total, users: [] }, // Dummy compliance
        globalStats,
        updateMyStatus: (_status?: string) => { }, // No-op
        socket: socketRef.current
    };
};

