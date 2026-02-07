import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, Edit3, Zap, Download, MousePointer, Ghost } from 'lucide-react';
import { PresenceUser } from '../hooks/useRoomPresence';

interface RoomPresenceBarProps {
    roomId: string;
    users: PresenceUser[];
    totalOnline: number;
    currentUser?: Partial<PresenceUser>; // For highlight
}

// Helper: Status Icons
const getStatusIcon = (status: PresenceUser['status']) => {
    switch (status) {
        case 'reading': return <Eye size={12} className="text-blue-500" />;
        case 'typing': return <Edit3 size={12} className="text-purple-500 animate-pulse" />;
        case 'generating': return <Zap size={12} className="text-yellow-500 animate-spin" />;
        case 'downloading': return <Download size={12} className="text-green-500 animate-bounce" />;
        case 'scrolling': return <MousePointer size={12} className="text-pink-500" />;
        case 'idle': return <Ghost size={12} className="text-stone-400" />;
        default: return <Eye size={12} className="text-stone-400" />;
    }
};

// Helper: Status Tooltip Text
const getStatusText = (user: PresenceUser) => {
    switch (user.status) {
        case 'reading': return `baca chat...`;
        case 'typing': return `lagi ngetik sesuatu...`;
        case 'generating': return `lagi generate wrap!`;
        case 'downloading': return `lagi download bukti sejarah.`;
        case 'scrolling': return `scroll cepet banget.`;
        case 'idle': return `lagi bengong/afk.`;
        default: return `online`;
    }
};

export const RoomPresenceBar: React.FC<RoomPresenceBarProps> = ({ users, totalOnline }) => {
    const [expanded, setExpanded] = useState(false);

    // Sort users: Active first, Idle last
    const sortedUsers = [...users].sort((a, b) => (a.status === 'idle' ? 1 : -1));
    const previewUsers = sortedUsers.slice(0, 3); // Show top 3
    const remainingCount = Math.max(0, totalOnline - 3);

    // Current Active Mood Logic (Simple)
    const isActiveRoom = totalOnline > 2;
    const isTyping = users.some(u => u.status === 'typing');

    const moodText = isTyping
        ? "✍️ Ada yang mau ngomong..."
        : isActiveRoom
            ? "🔥 Room ini lagi rame!"
            : "👀 Sepi... tapi ada yang baca.";

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-md px-4">
            <AnimatePresence>
                {/* Main Bar (Floating & Glassmorphism) */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="pointer-events-auto bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-lg px-4 py-2 flex items-center justify-between gap-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setExpanded(!expanded)}
                >
                    {/* Left: Online Badge */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                            {totalOnline} Online
                        </span>
                    </div>

                    {/* Middle: Mood / Status Text */}
                    <div className="hidden sm:block text-[10px] text-stone-500 dark:text-stone-400 font-medium truncate max-w-[120px]">
                        {moodText}
                    </div>

                    {/* Right: Avatar Stack */}
                    <div className="flex -space-x-2">
                        {previewUsers.map((user) => (
                            <div key={user.userId} className="relative group">
                                <div className={`w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm overflow-hidden
                                    ${user.role === 'couple' ? 'bg-pink-400' : 'bg-blue-400'}
                                `}>
                                    {user.displayName.charAt(0).toUpperCase()}
                                </div>
                                {/* Mini Status Icon Badge */}
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-800 rounded-full p-[2px]">
                                    {getStatusIcon(user.status)}
                                </div>
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-stone-900 bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[9px] font-bold text-stone-500">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Expanded Details Popup */}
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="pointer-events-auto mt-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-4 w-full max-h-[300px] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                            <h4 className="text-xs font-bold uppercase text-stone-500">Who's Here?</h4>
                            <button onClick={() => setExpanded(false)} className="text-stone-400 hover:text-stone-600">
                                <Users size={14} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {sortedUsers.map((user) => (
                                <div key={user.userId} className="flex items-center justify-between p-2 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm
                                            ${user.role === 'couple' ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}
                                        `}>
                                            {user.displayName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                                {user.displayName}
                                                {user.device === 'mobile' && <span className="text-[9px] px-1 bg-stone-100 dark:bg-stone-700 rounded text-stone-500">Mobile</span>}
                                            </div>
                                            <div className="text-xs text-stone-500 flex items-center gap-1">
                                                {getStatusIcon(user.status)}
                                                <span>{getStatusText(user)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-stone-400">
                                        {Math.floor((Date.now() - user.joinedAt) / 60000)}m ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
