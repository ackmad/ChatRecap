import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-2xl font-bold font-heading transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: #B8A9E6 text white, hover #A595E5
    primary: "bg-pastel-primary text-white hover:bg-pastel-primaryHover shadow-[0_4px_14px_0_rgba(184,169,230,0.39)] hover:shadow-[0_6px_20px_rgba(184,169,230,0.23)]",
    // Secondary: #E9F7EF text #4A6F63
    secondary: "bg-pastel-secondary text-pastel-secondaryText hover:bg-emerald-50 border border-emerald-100/50 shadow-sm",
    ghost: "bg-transparent text-txt-sub hover:text-txt-main hover:bg-stone-100/50"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};