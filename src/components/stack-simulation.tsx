"use client";

import React, { useEffect, useRef } from 'react';

// Declare Matter.js since it's loaded from a script tag
declare const Matter: any;

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
    backend: 'hsl(var(--primary))',
    frontend: 'hsl(142.1 76.2% 36.3%)',
    tool: 'hsl(var(--foreground))',
};

const categoryTextColors: Record<StackCategory, string> = {
    backend: 'hsl(var(--primary-foreground))',
    frontend: 'hsl(var(--primary-foreground))',
    tool: 'hsl(var(--background))',
};

export const StackSimulation = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>();

    useEffect(() => {
        if (typeof Matter === 'undefined') {
            console.error("Matter.js not loaded");
            return;
        }

        const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

        const container = sceneRef.current;
        if (!container) return;

        // Clear previous simulation if any
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        if (engineRef.current) {
            Runner.stop(engineRef.current.runner);
            Engine.clear(engineRef.current.engine);
        }

        const engine = Engine.create({ gravity: { y: 0.4 } });
        const runner = Runner.create();
        
        engineRef.current = { engine, runner };

        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: container.clientWidth,
                height: 288, // h-72
                background: 'transparent',
                wireframes: false,
            }
        });

        const bodies = stackItems.map(item => {
            const elWidth = item.name.length * 8 + 10;
            return Bodies.rectangle(
                Math.random() * container.clientWidth,
                Math.random() * -200, // Start above the canvas
                elWidth,
                24, // h-6
                {
                    restitution: 0.5,
                    friction: 0.3,
                    render: {
                        fillStyle: categoryColors[item.category],
                        strokeStyle: 'transparent',
                    }
                }
            );
        });

        const ground = Bodies.rectangle(container.clientWidth / 2, 288, container.clientWidth + 20, 10, { isStatic: true, render: { visible: false } });
        const wallLeft = Bodies.rectangle(-5, 144, 10, 288, { isStatic: true, render: { visible: false } });
        const wallRight = Bodies.rectangle(container.clientWidth + 5, 144, 10, 288, { isStatic: true, render: { visible: false } });

        Composite.add(engine.world, [...bodies, ground, wallLeft, wallRight]);
        
        // Add mouse control
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

        Render.run(render);
        Runner.run(runner, engine);

        // Custom rendering to draw text on bodies
        const customRender = () => {
            const context = render.context;
            bodies.forEach((body, index) => {
                const { x, y } = body.position;
                context.save();
                context.translate(x, y);
                context.rotate(body.angle);
                context.fillStyle = 'white';
                context.font = "8px 'Share Tech Mono', monospace";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(stackItems[index].name, 0, 0);
                context.restore();
            });
            requestAnimationFrame(customRender);
        };
        
        requestAnimationFrame(customRender);
        
        // Handle resize
        const handleResize = () => {
             if (!container || !render || !engineRef.current) return;
             render.canvas.width = container.clientWidth;
             Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: container.clientWidth, y: 288 }
            });
            // update ground and wall positions
            Bodies.setPosition(ground, { x: container.clientWidth / 2, y: 288 });
            Bodies.setPosition(wallRight, { x: container.clientWidth + 5, y: 144 });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (engineRef.current) {
                Runner.stop(engineRef.current.runner);
                Render.stop(render);
                Engine.clear(engineRef.current.engine);
            }
            if (render.canvas) {
                render.canvas.remove();
            }
            if (render.textures) {
                // @ts-ignore
                render.textures = {};
            }
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={sceneRef} className="w-full h-full" />;
};
