
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
    const [isClient, setIsClient] = useState(false);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const cleanup = useCallback(() => {
        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            if (renderRef.current.canvas) {
                renderRef.current.canvas.remove();
            }
        }
        if (runnerRef.current) {
            Matter.Runner.stop(runnerRef.current);
        }
        if (engineRef.current) {
            Matter.Engine.clear(engineRef.current);
        }
        engineRef.current = null;
        runnerRef.current = null;
        renderRef.current = null;
    }, []);

    const setup = useCallback(() => {
        if (!sceneRef.current) return;
        cleanup();

        const { Engine, Render, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;
        const container = sceneRef.current;
        const engine = Engine.create({ gravity: { x: 0, y: 1 } });
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
            const textWidth = item.name.length * 8 + 20; 
            return Bodies.rectangle(
                container.clientWidth / 2 + (Math.random() - 0.5) * 50,
                -50 - (Math.random() * 200),
                textWidth,
                30,
                {
                    restitution: 0.6,
                    friction: 0.5,
                    label: item.name,
                    chamfer: { radius: 15 },
                    render: {
                        fillStyle: colors[index % colors.length],
                    }
                }
            );
        });

        Composite.add(engine.world, [
            Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 30, container.clientWidth, 60, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(-30, container.clientHeight / 2, 60, container.clientHeight, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(container.clientWidth + 30, container.clientHeight / 2, 60, container.clientHeight, { isStatic: true, render: { visible: false } }),
            ...stackBodies
        ]);

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        Events.on(render, 'afterRender', () => {
            const context = render.context;
            if (!context) return;
            context.font = '14px "Share Tech Mono", monospace';
            context.fillStyle = 'hsl(var(--card-foreground))';
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

    }, [cleanup]);

    useEffect(() => {
        if (isClient) {
            setup();

            const handleResize = () => {
                if (sceneRef.current && sceneRef.current.clientWidth > 0) {
                   setup();
                }
            };
            
            const resizeObserver = new ResizeObserver(handleResize);
            if(sceneRef.current) {
                resizeObserver.observe(sceneRef.current);
            }

            return () => {
                resizeObserver.disconnect();
                cleanup();
            };
        }
    }, [isClient, setup, cleanup]);

    return (
        <div ref={sceneRef} className="h-full w-full" />
    );
};
