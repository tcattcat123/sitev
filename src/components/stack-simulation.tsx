"use client";

import React from 'react';
import { motion } from 'framer-motion';

type StackCategory = 'frontend' | 'backend' | 'tool';

const stackItems: { name: string; category: StackCategory }[] = [
    { name: 'React', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Tailwind', category: 'frontend' },
    { name: 'Go', category: 'backend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Python', category: 'backend' },
    { name: 'PHP', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'MySQL', category: 'backend' },
    { name: 'MongoDB', category: 'backend' },
    { name: 'Supabase', category: 'tool' },
    { name: 'OpenAI', category: 'tool' },
    { name: 'Telegram', category: 'tool' },
    { name: 'Parsers', category: 'tool' },
];

const categoryColors: Record<StackCategory, string> = {
    backend: 'hsl(var(--primary))', // Dark Blue
    frontend: 'hsl(142.1 76.2% 36.3%)', // Green
    tool: 'hsl(var(--foreground))', // Black (using foreground which is nearly black)
};

const categoryTextColors: Record<StackCategory, string> = {
    backend: 'hsl(var(--primary-foreground))',
    frontend: 'hsl(var(--primary-foreground))',
    tool: 'hsl(var(--background))',
}


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
                        backgroundColor: categoryColors[item.category],
                        color: categoryTextColors[item.category],
                        borderRadius: '0.125rem',
                        padding: '0.1rem 0.3rem',
                        fontSize: '0.5rem',
                        height: 'auto',
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
