'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

export const ProjectCard = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ 
        borderRadius: "50%",
        transition: { duration: 0.4, ease: 'circOut' }
      }}
      className={cn(
        'group relative aspect-square w-full bg-card p-4 overflow-hidden border border-primary cursor-pointer',
        className
      )}
    >
      {/* Content visible by default */}
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        {children}
      </div>
    </motion.div>
  );
};
