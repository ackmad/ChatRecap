import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, MessageCircle, FileText, Activity } from 'lucide-react';
import { LiveStats } from '../types';

interface LiveActivityWidgetProps {
  stats: LiveStats;
}

export const LiveActivityWidget: React.FC<LiveActivityWidgetProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative z-20 mb-8 mx-auto w-full max-w-sm"
    >
      <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md border border-purple-200 dark:border-stone-700 rounded-3xl p-5 shadow-lg shadow-purple-100/20 dark:shadow-none overflow-hidden relative group hover:scale-[1.02] transition-transform duration-500 ease-out">
        
        {/* Soft Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-dashed border-stone-200 dark:border-stone-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold font-heading text-stone-700 dark:text-stone-200 tracking-wide uppercase">Live Activity</span>
          </div>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
             <Activity size={10} />
             Real-time
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="space-y-4">
          
          {/* Total Active Users (Hero Number) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-primary to-pastel-lavender flex items-center justify-center text-white shadow-sm">
                    <Users size={20} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">Total Active Users</p>
                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={stats.online}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="text-2xl font-bold text-stone-800 dark:text-white font-heading leading-none"
                        >
                            {stats.online}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                    Online
                </span>
            </div>
          </div>

          {/* Detailed Breakdown (Bars) */}
          <div className="grid grid-cols-3 gap-2">
            {/* Analyzing */}
            <div className="bg-stone-50 dark:bg-stone-700/50 p-2 rounded-xl border border-stone-100 dark:border-stone-700 text-center">
                <div className="mb-1 flex justify-center text-blue-400"><Zap size={14} /></div>
                <div className="text-sm font-bold text-stone-700 dark:text-stone-200">{stats.analyzing}</div>
                <div className="text-[9px] text-stone-400 leading-tight">Scanning</div>
            </div>

             {/* Chatting */}
             <div className="bg-stone-50 dark:bg-stone-700/50 p-2 rounded-xl border border-stone-100 dark:border-stone-700 text-center">
                <div className="mb-1 flex justify-center text-purple-400"><MessageCircle size={14} /></div>
                <div className="text-sm font-bold text-stone-700 dark:text-stone-200">{stats.chatting}</div>
                <div className="text-[9px] text-stone-400 leading-tight">Chatting</div>
            </div>

             {/* Reading */}
             <div className="bg-stone-50 dark:bg-stone-700/50 p-2 rounded-xl border border-stone-100 dark:border-stone-700 text-center">
                <div className="mb-1 flex justify-center text-orange-400"><FileText size={14} /></div>
                <div className="text-sm font-bold text-stone-700 dark:text-stone-200">{stats.reading}</div>
                <div className="text-[9px] text-stone-400 leading-tight">Reading</div>
            </div>
          </div>

        </div>

        {/* Privacy Disclaimer Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 text-center">
            <p className="text-[9px] text-stone-400 dark:text-stone-500 font-medium">
                Statistik ini hanya menghitung jumlah pengguna aktif. <br/>
                <span className="text-stone-500 dark:text-stone-400 font-bold">Tidak ada chat yang disimpan.</span>
            </p>
        </div>
      </div>
    </motion.div>
  );
};