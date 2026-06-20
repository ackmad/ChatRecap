import { useState } from 'react';

// --- TYPES ---
export type PageCategory = 'landing' | 'creating' | 'reading';

export interface GlobalStats {
    landing: number;
    creating: number;
    result: number;
    total: number;
}

/**
 * Dummy hook replacing Firebase presence.
 * Since Firebase is removed, this simply returns static 0 counts.
 */
export const useRoomPresence = (
    _roomId: string | null,
    _userIdentity: any,
    _category: PageCategory = 'landing'
) => {
    const [globalStats] = useState<GlobalStats>({
        landing: 0,
        creating: 0,
        result: 0,
        total: 0
    });

    return {
        isConnected: false,
        presenceState: { roomId: 'global', onlineCount: 0, users: [] },
        globalStats,
        updateMyStatus: (_status?: string) => { }, // No-op
        socket: null
    };
};