'use client';

import { useEffect, useRef } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
  color?: 'white' | 'red' | 'blue' | 'green';
}

export function Noise({
  patternSize = 75,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 35,
  className = '',
  color = 'white',
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const generateNoise = () => {
      if (!ctx) return;

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        
        switch (color) {
          case 'red':
            data[i] = noise;     // Red
            data[i + 1] = 0;     // Green
            data[i + 2] = 0;     // Blue
            break;
          case 'blue':
            data[i] = 0;         // Red
            data[i + 1] = 0;     // Green
            data[i + 2] = noise; // Blue
            break;
          case 'green':
            data[i] = 0;         // Red
            data[i + 1] = noise; // Green
            data[i + 2] = 0;     // Blue
            break;
          default: // white
            data[i] = noise;     // Red
            data[i + 1] = noise; // Green
            data[i + 2] = noise; // Blue
        }
        
        data[i + 3] = patternAlpha; // Alpha
      }

      ctx.putImageData(imageData, 0, 0);
    };

    resizeCanvas();
    generateNoise();

    const interval = setInterval(generateNoise, patternRefreshInterval * 1000);

    const handleResize = () => {
      resizeCanvas();
      generateNoise();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        mixBlendMode: 'overlay',
        opacity: patternAlpha / 100,
      }}
    />
  );
}
