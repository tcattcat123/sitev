
"use client";

import React, { useState, useEffect, useRef } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({ text, speed = 20, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const startTypingTimer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(startTypingTimer);
  }, [text, speed, delay, isClient]);

  if (!isClient) {
    return <span className={className}></span>;
  }

  return (
    <span className={className}>
      <span>{displayedText}</span>
      {displayedText.length < text.length && <span className="cursor-blink">_</span>}
    </span>
  );
};
