import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  children?: React.ReactNode;
  className?: string; // Add className explicitly here
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
  // HTMLMotionProps already includes onClick, disabled, etc. but we can be explicit if needed
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props // This captures onClick and other HTML/Motion props
}) => {
  const baseStyle = "relative overflow-hidden px-6 py-3 rounded-2xl font-bold font-heading transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-primary/50 disabled:opacity-50 disabled:cursor-not-allowed group";

  const variantStyles = {
    // Primary: Custom shadow + gradient bg effect
    primary: "bg-gradient-to-br from-pastel-primary via-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl shadow-pastel-primary/30 border border-white/20",
    // Secondary: Softer look
    secondary: "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-pastel-primary dark:hover:border-pastel-primary hover:bg-stone-50 dark:hover:bg-stone-700 shadow-sm",
    // Ghost: No background
    ghost: "bg-transparent text-stone-600 dark:text-stone-400 hover:text-pastel-primary hover:bg-stone-100/50 dark:hover:bg-stone-800/50",
    // Outline
    outline: "bg-transparent border-2 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-pastel-primary hover:text-pastel-primary"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      className={`${baseStyle} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      {/* Shine Effect for Primary Button */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none" />
      )}
    </motion.button>
  );
};