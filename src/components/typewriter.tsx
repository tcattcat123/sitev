
"use client";

import React, { useState, useEffect, useRef } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string; stopBlinkingOnEnd?: boolean }> = ({ text, speed = 20, delay = 0, className, stopBlinkingOnEnd = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const progressRef = useRef(0);
  const delayTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      progressRef.current += deltaTime;

      if (progressRef.current > speed) {
        progressRef.current = 0;
        setDisplayedText(prev => {
          const nextChar = text[prev.length];
          if (nextChar) {
            return prev + nextChar;
          } else {
            // End of text
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (stopBlinkingOnEnd) setIsTyping(false);
            return prev;
          }
        });
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    if (!isClient || !text) return;

    // Reset state for new text
    setDisplayedText('');
    setIsTyping(true);
    progressRef.current = 0;
    previousTimeRef.current = undefined;

    // Clear any existing animations/timeouts
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);

    delayTimeoutRef.current = setTimeout(() => {
      requestRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, [text, speed, delay, isClient, stopBlinkingOnEnd]);


  if (!isClient) {
    return <span className={className}>&nbsp;</span>;
  }

  const showCursor = isTyping || !stopBlinkingOnEnd;

  return (
    <span className={className}>
      <span>{displayedText}</span>
      {showCursor && <span className="cursor-blink">_</span>}
    </span>
  );
};
