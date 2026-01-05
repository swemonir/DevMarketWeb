import React from 'react';
import { motion } from 'framer-motion';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}
export function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick
}: CardProps) {
  const baseClasses = 'bg-[#151b2d] rounded-xl border border-gray-800 overflow-hidden';
  if (hoverEffect) {
    return <motion.div whileHover={{
      y: -4,
      scale: 1.01
    }} transition={{
      duration: 0.2
    }} className={`${baseClasses} shadow-xl hover:shadow-2xl hover:border-gray-700 cursor-pointer ${className}`} onClick={onClick}>
        {children}
      </motion.div>;
  }
  return <div className={`${baseClasses} shadow-lg ${className}`} onClick={onClick}>
      {children}
    </div>;
}