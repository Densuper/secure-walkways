
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  delay?: number;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card = ({ 
  children, 
  className, 
  glass = false,
  delay = 0,
  onClick,
  hoverable = false
}: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        delay: delay * 0.1
      }}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
      className={cn(
        "rounded-lg border p-6 shadow-sm", 
        glass ? "glass-card" : "bg-card",
        hoverable && "cursor-pointer transition-all",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
