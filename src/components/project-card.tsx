'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

export const ProjectCard = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ borderRadius: '50%' }}
      transition={{ duration: 0.4, ease: 'circOut' }}
      className={cn(
        'group relative aspect-square w-full bg-card p-4 overflow-hidden border border-primary cursor-pointer',
        className
      )}
    >
      {/* Content visible by default */}
      <motion.div 
        className="relative z-10 h-full flex items-center justify-center text-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Monitor effect visible only on hover */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="glitch-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
    </motion.div>
  );
};
