import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresenceUser } from '../hooks/useRoomPresence';

export const PresenceToast: React.FC = () => {
    const [notifications, setNotifications] = useState<{ id: number, type: 'join' | 'leave', user: PresenceUser }[]>([]);

    useEffect(() => {
        const handleToast = (event: CustomEvent<{ type: 'join' | 'leave', user: PresenceUser }>) => {
            const newToast = {
                id: Date.now(),
                type: event.detail.type,
                user: event.detail.user
            };

            setNotifications((prev) => [...prev, newToast]);

            // Auto dismiss after 3s
            setTimeout(() => {
                setNotifications((prev) => prev.filter(n => n.id !== newToast.id));
            }, 3000);
        };

        window.addEventListener('presence-toast', handleToast as EventListener);
        return () => window.removeEventListener('presence-toast', handleToast as EventListener);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-md rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 p-3 max-w-[200px] flex items-center gap-3 pointer-events-auto"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                            ${n.type === 'join' ? 'bg-green-500' : 'bg-stone-400'}
                        `}>
                            {n.type === 'join' ? '👋' : '🚪'}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                                {n.user.displayName}
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight">
                                {n.type === 'join' ? 'Baru masuk room, kepo nih.' : 'Keluar dulu, mungkin malu.'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
