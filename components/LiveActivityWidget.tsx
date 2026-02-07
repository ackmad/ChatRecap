import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, FileText, ChevronDown, Activity } from 'lucide-react';

export interface GlobalStats {
  landing: number;
  creating: number;
  result: number;
  total: number;
}

interface LiveActivityWidgetProps {
  stats: GlobalStats;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  return (
    <div className="w-5 text-center inline-block tabular-nums">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const LiveActivityWidget: React.FC<LiveActivityWidgetProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Categories data
  const categories = [
    {
      id: 'landing',
      label: 'Landing Page',
      count: stats.landing,
      icon: Home,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'creating',
      label: 'Chatting/Creating',
      count: stats.creating,
      icon: MessageSquare,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    },
    {
      id: 'result',
      label: 'Recap/Summary',
      count: stats.result,
      icon: FileText,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ];

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Widget Trigger */}
      <motion.div
        className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-full border border-stone-200 dark:border-stone-800 cursor-pointer hover:bg-white hover:shadow-md transition-all group"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {/* Indicator Dot */}
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>

        {/* Count & Label */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-stone-800 dark:text-stone-100 font-mono tabular-nums">
            {stats.total.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Online
          </span>
        </div>

        {/* Mobile Chevron */}
        <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.div>

      {/* Dropdown / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-stone-50 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                Live User Activity
              </h4>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                Realtime
              </span>
            </div>

            {/* List */}
            <div className="p-2 space-y-1">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group/item">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cat.color} ring-1 ring-black/5 dark:ring-white/5`}>
                      <cat.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {cat.label}
                      </p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">
                        Active Now
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg font-mono min-w-[3ch] inline-block text-center group-hover/item:bg-white dark:group-hover/item:bg-stone-700 shadow-sm transition-all">
                      {cat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Connection Status */}
            <div className="px-4 py-2 bg-stone-50 dark:bg-stone-800/30 text-center border-t border-stone-50 dark:border-stone-800">
              <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Data Connection Active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};