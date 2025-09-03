
"use client";

import React, { useEffect, useRef, useState } from 'react';

// Declare Matter.js since it's loaded from a script tag
declare const Matter: any;
// Extend the Window interface for DeviceOrientationEvent permission method
declare global {
    interface Window {
        DeviceOrientationEvent?: {
            requestPermission?: () => Promise<'granted' | 'denied'>;
        };
    }
}


type StackCategory = 'frontend' | 'backend' | 'tool';

const stackItems: { name: string; category: StackCategory; width: number, height: number }[] = [
    { name: 'React', category: 'frontend', width: 75, height: 30 },
    { name: 'Next.js', category: 'frontend', width: 85, height: 30 },
    { name: 'Tailwind', category: 'frontend', width: 100, height: 30 },
    { name: 'Go', category: 'backend', width: 50, height: 30 },
    { name: 'Node.js', category: 'backend', width: 85, height: 30 },
    { name: 'Python', category: 'backend', width: 85, height: 30 },
    { name: 'PHP', category: 'backend', width: 60, height: 30 },
    { name: 'PostgreSQL', category: 'backend', width: 125, height: 30 },
    { name: 'MySQL', category: 'backend', width: 75, height: 30 },
    { name: 'MongoDB', category: 'backend', width: 110, height: 30 },
    { name: 'Supabase', category: 'tool', width: 100, height: 30 },
    { name: 'OpenAI', category: 'tool', width: 75, height: 30 },
    { name: 'Telegram', category: 'tool', width: 100, height: 30 },
    { name: 'Parsers', category: 'tool', width: 85, height: 30 },
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
    
    const requestDeviceOrientationPermission = async () => {
        if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await window.DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    return true;
                }
                return false;
            } catch (error) {
                console.error("DeviceOrientationEvent.requestPermission() failed:", error);
                return false;
            }
        }
        // For non-iOS 13+ devices, permission is not required or granted by default
        return true;
    };

    useEffect(() => {
        if (typeof Matter === 'undefined') {
            console.error("Matter.js not loaded");
            return;
        }

        const { Engine, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;

        const container = sceneRef.current;
        if (!container) return;
        
        const engine = Engine.create({ gravity: { y: 0.4, x: 0 } });
        const runner = Runner.create();
        engineRef.current = { engine, runner };

        const matterBodies = stackItems.map(item => 
            Bodies.rectangle(
                Math.random() * container.clientWidth,
                Math.random() * -300,
                item.width,
                item.height,
                {
                    restitution: 0.5,
                    friction: 0.3,
                    label: item.name
                }
            )
        );

        const ground = Bodies.rectangle(container.clientWidth / 2, 184, container.clientWidth + 20, 10, { isStatic: true, render: { visible: false } });
        const wallLeft = Bodies.rectangle(-5, 96, 10, 192, { isStatic: true, render: { visible: false } });
        const wallRight = Bodies.rectangle(container.clientWidth + 5, 96, 10, 192, { isStatic: true, render: { visible: false } });

        Composite.add(engine.world, [...matterBodies, ground, wallLeft, wallRight]);
        
        const mouse = Mouse.create(container);
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

        Runner.run(runner, engine);

        Events.on(engine, 'afterUpdate', () => {
            const updatedBodies = matterBodies.map(body => {
                const stackItem = stackItems.find(it => it.name === body.label)!;
                return {
                    id: body.id,
                    position: body.position,
                    angle: body.angle,
                    width: stackItem.width,
                    height: stackItem.height,
                    category: stackItem.category,
                    name: stackItem.name
                };
            });
            setBodies(updatedBodies);
        });
        
        const handleResize = () => {
             if (!container || !engineRef.current) return;
             
             Bodies.setPosition(ground, { x: container.clientWidth / 2, y: 184 });
             Bodies.setVertices(ground, [
                { x: 0, y: 184 },
                { x: container.clientWidth, y: 184 },
                { x: container.clientWidth, y: 194 },
                { x: 0, y: 194 }
             ]);
             Bodies.setPosition(wallRight, { x: container.clientWidth + 5, y: 96 });
        };
        window.addEventListener('resize', handleResize);

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!engine.gravity || !event.gamma || !event.beta) return;
            const { gamma, beta } = event; // gamma: left-right, beta: front-back
            
            // Normalize gamma and beta to a range of [-1, 1]
            const gravityX = Math.min(Math.max(gamma / 45, -1), 1);
            const gravityY = Math.min(Math.max(beta / 90 - 0.5, -1), 1);

            engine.gravity.x = gravityX;
            engine.gravity.y = gravityY;
        };

        const setupGyro = async () => {
            const granted = await requestDeviceOrientationPermission();
            if (granted) {
                 window.addEventListener('deviceorientation', handleOrientation);
            }
        };
        
        // Automatically try to setup gyro on component mount
        setupGyro();

        return () => {
            if (engineRef.current) {
                Runner.stop(engineRef.current.runner);
                Engine.clear(engineRef.current.engine);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <div ref={sceneRef} className="w-full h-full relative overflow-hidden bg-background">
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
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '2px solid rgba(0,0,0,0.2)'
                    }}
                >
                    {body.name}
                </div>
            ))}
        </div>
    );
};
