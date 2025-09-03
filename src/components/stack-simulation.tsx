
"use client";

import React, { useEffect, useRef, useState } from 'react';

// Declare Matter.js since it's loaded from a script tag
declare const Matter: any;

type StackCategory = 'frontend' | 'backend' | 'tool';

const stackItems: { name: string; category: StackCategory; width: number }[] = [
    { name: 'React', category: 'frontend', width: 80 },
    { name: 'Next.js', category: 'frontend', width: 90 },
    { name: 'Tailwind', category: 'frontend', width: 100 },
    { name: 'Go', category: 'backend', width: 50 },
    { name: 'Node.js', category: 'backend', width: 90 },
    { name: 'Python', category: 'backend', width: 90 },
    { name: 'PHP', category: 'backend', width: 60 },
    { name: 'PostgreSQL', category: 'backend', width: 120 },
    { name: 'MySQL', category: 'backend', width: 80 },
    { name: 'MongoDB', category: 'backend', width: 110 },
    { name: 'Supabase', category: 'tool', width: 100 },
    { name: 'OpenAI', category: 'tool', width: 80 },
    { name: 'Telegram', category: 'tool', width: 100 },
    { name: 'Parsers', category: 'tool', width: 90 },
];

const categoryColors: Record<StackCategory, string> = {
    backend: 'hsl(var(--primary))',
    frontend: 'hsl(142.1 76.2% 36.3%)',
    tool: 'hsl(var(--foreground))',
};

const categoryTextColors: Record<StackCategory, string> = {
    backend: 'hsl(var(--primary-foreground))',
    frontend: 'hsl(var(--primary-foreground))',
    tool: 'hsl(var(--background))',
};

interface BodyState {
    id: number;
    position: { x: number; y: number };
    angle: number;
    width: number;
    height: number;
    category: StackCategory;
    name: string;
}

export const StackSimulation = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>();
    const [bodies, setBodies] = useState<BodyState[]>([]);

    useEffect(() => {
        if (typeof Matter === 'undefined') {
            console.error("Matter.js not loaded");
            return;
        }

        const { Engine, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;

        const container = sceneRef.current;
        if (!container) return;
        
        const engine = Engine.create({ gravity: { y: 0.4 } });
        const runner = Runner.create();
        engineRef.current = { engine, runner };

        const matterBodies = stackItems.map(item => 
            Bodies.rectangle(
                Math.random() * container.clientWidth,
                Math.random() * -300,
                item.width,
                32,
                {
                    restitution: 0.5,
                    friction: 0.3,
                    label: item.name,
                    render: {
                        fillStyle: categoryColors[item.category],
                        strokeStyle: 'transparent',
                    }
                }
            )
        );

        const ground = Bodies.rectangle(container.clientWidth / 2, 288, container.clientWidth + 20, 10, { isStatic: true, render: { visible: false } });
        const wallLeft = Bodies.rectangle(-5, 144, 10, 288, { isStatic: true, render: { visible: false } });
        const wallRight = Bodies.rectangle(container.clientWidth + 5, 144, 10, 288, { isStatic: true, render: { visible: false } });

        Composite.add(engine.world, [...matterBodies, ground, wallLeft, wallRight]);

        // Render canvas for physics visualization but no text
        const render = Matter.Render.create({
            element: container,
            engine: engine,
            options: {
                width: container.clientWidth,
                height: 288,
                wireframes: false,
                background: 'transparent',
            }
        });
        
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

        Matter.Render.run(render);
        Runner.run(runner, engine);

        // Update React state with body positions on each physics update
        Events.on(engine, 'afterUpdate', () => {
            const updatedBodies = matterBodies.map(body => {
                const stackItem = stackItems.find(it => it.name === body.label)!;
                return {
                    id: body.id,
                    position: body.position,
                    angle: body.angle,
                    width: stackItem.width,
                    height: 32,
                    category: stackItem.category,
                    name: stackItem.name
                };
            });
            setBodies(updatedBodies);
        });
        
        const handleResize = () => {
             if (!container || !render || !engineRef.current) return;
             render.canvas.width = container.clientWidth;
             Matter.Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: container.clientWidth, y: 288 }
            });
            Bodies.setPosition(ground, { x: container.clientWidth / 2, y: 288 });
            Bodies.setPosition(wallRight, { x: container.clientWidth + 5, y: 144 });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (engineRef.current) {
                Runner.stop(engineRef.current.runner);
                Matter.Render.stop(render);
                Engine.clear(engineRef.current.engine);
            }
            if (render.canvas) {
                 if (container.contains(render.canvas)) {
                    container.removeChild(render.canvas);
                }
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={sceneRef} className="w-full h-full relative overflow-hidden">
            {bodies.map(body => (
                <div
                    key={body.id}
                    style={{
                        position: 'absolute',
                        left: `${body.position.x}px`,
                        top: `${body.position.y}px`,
                        width: `${body.width}px`,
                        height: `${body.height}px`,
                        backgroundColor: categoryColors[body.category],
                        color: categoryTextColors[body.category],
                        transform: `translate(-50%, -50%) rotate(${body.angle}rad)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {body.name}
                </div>
            ))}
        </div>
    );
};

    