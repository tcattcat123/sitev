
"use client";

import React, { useEffect, useRef } from 'react';
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
    const engineRef = useRef(Matter.Engine.create());
    const runnerRef = useRef(Matter.Runner.create());

    useEffect(() => {
        const engine = engineRef.current;
        engine.world.gravity.y = 0.6; 
        const runner = runnerRef.current;
        
        const scene = sceneRef.current;
        if (!scene) return;

        const render = Matter.Render.create({
            element: scene,
            engine: engine,
            options: {
                width: scene.clientWidth,
                height: scene.clientHeight,
                wireframes: false,
                background: 'transparent',
            }
        });

        const wallOptions = {
            isStatic: true,
            render: { fillStyle: 'transparent', strokeStyle: 'transparent' }
        };

        const ground = Matter.Bodies.rectangle(scene.clientWidth / 2, scene.clientHeight, scene.clientWidth, 20, wallOptions);
        const wallLeft = Matter.Bodies.rectangle(0, scene.clientHeight / 2, 20, scene.clientHeight, wallOptions);
        const wallRight = Matter.Bodies.rectangle(scene.clientWidth, scene.clientHeight / 2, 20, scene.clientHeight, wallOptions);
        const ceiling = Matter.Bodies.rectangle(scene.clientWidth / 2, 0, scene.clientWidth, 20, wallOptions);
        
        Matter.World.add(engine.world, [ground, wallLeft, wallRight, ceiling]);

        const bodies = stackItems.map((item, index) => {
            const width = item.name.length * 6 + 16;
            const height = 24;
            return Matter.Bodies.rectangle(
                Math.random() * (scene.clientWidth - width) + width / 2,
                Math.random() * (scene.clientHeight / 2),
                width,
                height,
                {
                    restitution: 0.5,
                    friction: 0.3,
                    render: {
                        fillStyle: colors[index % colors.length],
                        // Custom property to pass text to the renderer
                        text: {
                            content: item.name,
                            color: 'hsl(var(--card-foreground))',
                            size: 10,
                            family: '"Share Tech Mono", monospace',
                        }
                    }
                }
            );
        });

        Matter.World.add(engine.world, bodies);

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Matter.World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Custom text rendering
        Matter.Events.on(render, 'afterRender', () => {
            const context = render.context;
            context.save();
            engine.world.bodies.forEach(body => {
                if (body.render.text) {
                    const { content, color, size, family } = body.render.text;
                    const { x, y } = body.position;
                    context.fillStyle = color;
                    context.font = `${size}px ${family}`;
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    // Rotate text with the body
                    context.translate(x, y);
                    context.rotate(body.angle);
                    context.fillText(content, 0, 0);
                    context.rotate(-body.angle);
                    context.translate(-x, -y);
                }
            });
            context.restore();
        });

        Matter.Runner.run(runner, engine);
        Matter.Render.run(render);
        
        const handleResize = () => {
            if (!scene) return;
            render.canvas.width = scene.clientWidth;
            render.canvas.height = scene.clientHeight;
            Matter.Body.setPosition(ground, Matter.Vector.create(scene.clientWidth / 2, scene.clientHeight));
            Matter.Body.setPosition(wallRight, Matter.Vector.create(scene.clientWidth, scene.clientHeight / 2));
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return <div ref={sceneRef} className="w-full h-full" />;
};
