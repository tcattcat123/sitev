
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

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
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const [isClient, setIsClient] = useState(false);
    const isSetup = useRef(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const cleanupMatter = useCallback(() => {
        if (!isSetup.current) return;
        
        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            if (renderRef.current.canvas) {
                renderRef.current.canvas.remove();
            }
            renderRef.current = null;
        }
        if (runnerRef.current) {
            Matter.Runner.stop(runnerRef.current);
            runnerRef.current = null;
        }
        if (engineRef.current) {
            Matter.Engine.clear(engineRef.current);
            engineRef.current = null;
        }
        isSetup.current = false;
    }, []);

    const setupMatter = useCallback(() => {
        if (!sceneRef.current || isSetup.current || !isClient) return;
        
        isSetup.current = true;

        const { Engine, Render, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;
        const container = sceneRef.current;
        if (!container) return;
        
        const engine = Engine.create({
            gravity: { x: 0, y: 1, scale: 0.001 }
        });
        engineRef.current = engine;
        
        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: container.clientWidth,
                height: container.clientHeight,
                wireframes: false,
                background: 'transparent',
            }
        });
        renderRef.current = render;
        
        const stackBodies = stackItems.map((item, index) => {
            const textWidth = item.name.length * 8 + 16;
            return Bodies.rectangle(
                Math.random() * container.clientWidth * 0.8 + container.clientWidth * 0.1,
                Math.random() * -container.clientHeight,
                textWidth,
                28,
                {
                    restitution: 0.5,
                    friction: 0.6,
                    label: item.name,
                    chamfer: { radius: 14 },
                    render: {
                        fillStyle: colors[index % colors.length],
                    }
                }
            );
        });

        Composite.add(engine.world, [
            Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 20, container.clientWidth, 40, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(-20, container.clientHeight / 2, 40, container.clientHeight, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(container.clientWidth + 20, container.clientHeight / 2, 40, container.clientHeight, { isStatic: true, render: { visible: false } }),
            ...stackBodies
        ]);
        
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;


        Events.on(render, 'afterRender', () => {
            if (!render.context) return;
            const context = render.context;
            context.font = '14px "Share Tech Mono", monospace';
            context.fillStyle = 'hsl(var(--primary-foreground))';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            stackBodies.forEach(body => {
                context.save();
                context.translate(body.position.x, body.position.y);
                context.rotate(body.angle);
                context.fillText(body.label, 0, 0);
                context.restore();
            });
        });
        
        const runner = Runner.create();
        runnerRef.current = runner;
        Render.run(render);
        Runner.run(runner, engine);
    }, [isClient]);
    
    useEffect(() => {
        if (isClient) {
            cleanupMatter();
            setupMatter();
        }

        const handleResize = () => {
            cleanupMatter();
            setupMatter();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cleanupMatter();
        };
    }, [isClient, setupMatter, cleanupMatter]);

    if (!isClient) {
        return null; 
    }

    return (
        <div ref={sceneRef} className="h-full w-full relative" />
    );
};
