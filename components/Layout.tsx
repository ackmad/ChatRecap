import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

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
  const defaultBg = bgClasses ? '' : 'bg-gradient-to-br from-stone-50 via-white to-purple-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-purple-950/30';

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${bgClasses || defaultBg} transition-colors duration-500`}>
      {/* Scroll Progress Indicator - Enhanced */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 origin-left z-50 shadow-lg shadow-purple-500/50"
        style={{ scaleX }}
      />

      {/* Background Noise Texture */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-10 mix-blend-overlay"></div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-10 min-h-screen flex flex-col items-center p-6 md:p-12 w-full max-w-7xl mx-auto ${otherClasses}`}
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 tracking-tight font-heading leading-tight">
              {title}
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mt-6 shadow-lg shadow-purple-500/50" />
          </motion.div>
        )}
        {children}
      </motion.div>
    </div>
  );
};