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
  const defaultBg = bgClasses ? '' : 'bg-gradient-to-b from-pastel-bgStart to-pastel-bgEnd dark:from-stone-950 dark:to-stone-900';

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${bgClasses || defaultBg} transition-colors duration-500`}>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pastel-primary via-purple-400 to-pink-400 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Background Noise Texture */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-30 mix-blend-overlay"></div>

      {/* Animated Blurred Blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pastel-primary/20 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-pastel-card/30 dark:bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Main Content Container with improved spacing and structure */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative z-10 min-h-screen flex flex-col items-center p-6 md:p-12 w-full max-w-7xl mx-auto ${otherClasses}`} // Increased max-width and padding
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-100 dark:to-stone-400 tracking-tight font-heading leading-tight">
              {title}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-pastel-primary to-pink-400 rounded-full mx-auto mt-6 opacity-80" />
          </motion.div>
        )}
        {children}
      </motion.div>
    </div>
  );
};