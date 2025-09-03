"use client";

import React from 'react';
import { motion } from 'framer-motion';

const stackItems = [
    { name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind' },
    { name: 'Go' }, { name: 'Node.js' }, { name: 'Python' }, 
    { name: 'PHP' }, { name: 'PostgreSQL' }, { name: 'MySQL' }, 
    { name: 'Supabase' }, { name: 'MongoDB' }, { name: 'OpenAI' }, 
    { name: 'Telegram' }, { name: 'Parsers' },
];

const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))',
];

export const StackSimulation = () => {
    return (
        <div className="relative w-full h-full">
            {stackItems.map((item, index) => (
                <motion.div
                    key={item.name}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.5}
                    initial={{ opacity: 0, scale: 0.5, x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="absolute flex items-center justify-center cursor-grab"
                    style={{
                        backgroundColor: colors[index % colors.length],
                        color: 'hsl(var(--card-foreground))',
                        borderRadius: '0.25rem', // 4px
                        padding: '0.125rem 0.5rem', // h-2 p-2
                        fontSize: '0.65rem', // text-xs
                        height: 'auto',
                        // Position elements somewhat randomly to start
                        top: `${20 + (index % 5) * 15}%`,
                        left: `${10 + Math.floor(index / 5) * 20 + (Math.random() - 0.5) * 10}%`,
                    }}
                    whileTap={{ cursor: "grabbing", scale: 1.1 }}
                >
                    {item.name}
                </motion.div>
            ))}
        </div>
    );
};
