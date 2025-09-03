"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getTiltControlledGravity, type TiltControlledGravityInput } from '@/ai/flows/dynamic-stack-tilt';
import { Button } from './ui/button';

declare var Matter: any;

export const StackSimulation = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);
    const runnerRef = useRef<any>(null);
    const renderRef = useRef<any>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const stackItems = [
        { name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind' },
        { name: 'Go' }, { name: 'Node.js' }, { name: 'Python' }, 
        { name: 'PHP' }, { name: 'PostgreSQL' }, { name: 'MySQL' }, 
        { name: 'Supabase' }, { name: 'MongoDB' }, { name: 'OpenAI' }, 
        { name: 'Telegram' }, { name: 'Parsers' },
    ];

    const cleanupMatter = useCallback(() => {
        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            if (engineRef.current?.world) {
                Matter.World.clear(engineRef.current.world, false);
            }
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
            }
            renderRef.current.canvas?.remove();
            renderRef.current = null;
        }
        if (runnerRef.current) {
            Matter.Runner.stop(runnerRef.current);
            runnerRef.current = null;
        }
    }, []);

    const setupMatter = useCallback(() => {
        if (!sceneRef.current || typeof Matter === 'undefined' || renderRef.current) return;

        const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;
        const container = sceneRef.current;
        
        const engine = Engine.create();
        engineRef.current = engine;
        engine.world.gravity.y = 1;
        
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
        
        const stackBodies = stackItems.map(item => {
            const textWidth = item.name.length * 8 + 16;
            return Bodies.rectangle(
                Math.random() * container.clientWidth * 0.8 + container.clientWidth * 0.1,
                Math.random() * -container.clientHeight - 50,
                textWidth,
                28,
                {
                    restitution: 0.4,
                    friction: 0.8,
                    label: item.name,
                    chamfer: { radius: 4 },
                    render: {
                        fillStyle: 'hsl(var(--primary))',
                    }
                }
            );
        });

        Composite.add(engine.world, [
            Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 10, container.clientWidth, 20, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(-10, container.clientHeight / 2, 20, container.clientHeight, { isStatic: true, render: { visible: false } }),
            Bodies.rectangle(container.clientWidth + 10, container.clientHeight / 2, 20, container.clientHeight, { isStatic: true, render: { visible: false } }),
            ...stackBodies
        ]);

        Events.on(render, 'afterRender', () => {
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
    }, [stackItems]);

    const handleOrientation = useCallback(async (event: DeviceOrientationEvent) => {
        if (!engineRef.current || !event.gamma || !event.beta) return;

        const input: TiltControlledGravityInput = {
            tiltLR: event.gamma,
            tiltFB: event.beta,
            hasDeviceOrientation: true,
        };

        const { gravityX, gravityY } = await getTiltControlledGravity(input);
        engineRef.current.world.gravity.x = gravityX;
        engineRef.current.world.gravity.y = gravityY;
    }, []);
    
    const resimulate = useCallback(async () => {
        if (typeof Matter === 'undefined') return;
        const { shouldResimulate } = await getTiltControlledGravity({ hasDeviceOrientation: false });
        if (shouldResimulate) {
            cleanupMatter();
            setupMatter();
        }
    }, [cleanupMatter, setupMatter]);
    
    const requestPermission = useCallback(() => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: 'granted' | 'denied' | 'prompt') => {
                    if (permissionState === 'granted') {
                        setHasPermission(true);
                    } else {
                        setHasPermission(false);
                    }
                })
                .catch(() => setHasPermission(false));
        } else {
            // For browsers that don't require permission but have the event
             if ('ondeviceorientation' in window) {
                setHasPermission(true);
            } else {
                setHasPermission(false);
            }
        }
    }, []);

    useEffect(() => {
        const matterJsCheck = setInterval(() => {
            if (typeof Matter !== 'undefined') {
                clearInterval(matterJsCheck);
                setupMatter();
                // Check if permission is needed
                if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function' && 'ondeviceorientation' in window) {
                    setHasPermission(true);
                }
            }
        }, 100);

        return () => {
            clearInterval(matterJsCheck);
            cleanupMatter();
        };
    }, [setupMatter, cleanupMatter]);

    useEffect(() => {
        if (hasPermission) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else {
            window.removeEventListener('deviceorientation', handleOrientation);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [hasPermission, handleOrientation]);

    useEffect(() => {
        let resimulateInterval: NodeJS.Timeout;
        if (hasPermission === false) {
             resimulateInterval = setInterval(resimulate, 8000);
        }
        return () => clearInterval(resimulateInterval);
    }, [hasPermission, resimulate]);

    return (
        <div ref={sceneRef} className="h-full w-full relative">
            {hasPermission === null && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10 p-4">
                    <Button variant="outline" className="w-full" onClick={requestPermission}>
                        ENABLE TILT CONTROLS
                    </Button>
                </div>
            )}
            {hasPermission === false && (
                <div className="absolute bottom-2 left-2 text-xs text-muted-foreground z-10">
                    Tilt controls disabled. Auto-simulating...
                </div>
            )}
        </div>
    );
};
