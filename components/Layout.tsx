import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, className = "" }) => {
  // Extract background-related classes from className
  const bgClasses = className.split(' ').filter(c =>
    c.includes('bg-') || c.includes('from-') || c.includes('to-') || c.includes('via-') || c.includes('dark:')
  ).join(' ');

  // Extract non-background classes
  const otherClasses = className.split(' ').filter(c =>
    !c.includes('bg-') && !c.includes('from-') && !c.includes('to-') && !c.includes('via-') && !c.includes('dark:')
  ).join(' ');

  // Default background if no custom background provided
  const defaultBg = bgClasses ? '' : 'bg-gradient-to-b from-pastel-bgStart to-pastel-bgEnd dark:from-stone-950 dark:to-stone-900';

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${bgClasses || defaultBg} transition-colors duration-300`}>
      {/* Background Noise Texture */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-40 mix-blend-overlay"></div>

      {/* Blurred Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-pastel-primary/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-pastel-card/30 dark:bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full ${otherClasses}`}
      >
        {title && (
          <h1 className="text-3xl font-bold text-txt-main dark:text-stone-100 mb-8 tracking-tight text-center font-heading">{title}</h1>
        )}
        {children}
      </motion.div>
    </div>
  );
};