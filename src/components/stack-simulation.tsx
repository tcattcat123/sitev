
"use client";

import React, { useRef } from 'react';
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
    const constraintsRef = useRef(null);

    return (
        <motion.div ref={constraintsRef} className="relative h-full w-full">
            {stackItems.map((item, index) => (
                <motion.div
                    key={item.name}
                    drag
                    dragConstraints={constraintsRef}
                    initial={{ opacity: 0, scale: 0.5, y: -50, x: (Math.random() - 0.5) * 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 10,
                        delay: index * 0.05,
                    }}
                    whileTap={{ scale: 1.1, zIndex: 10 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-1/2 left-1/2 cursor-grab rounded-md px-2 py-1 font-mono text-xs font-medium text-card-foreground shadow-md"
                    style={{ 
                        backgroundColor: colors[index % colors.length],
                        width: `${item.name.length * 6 + 16}px`,
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {item.name}
                </motion.div>
            ))}
        </motion.div>
    );
};
