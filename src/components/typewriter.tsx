
"use client";

import React, { useState, useEffect } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string; stopBlinkingOnEnd?: boolean }> = ({ text, speed = 20, delay = 0, className, stopBlinkingOnEnd = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !text) return;
    
    setDisplayedText(''); 
    setIsTyping(true);

    const startTypingTimer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(startTypingTimer);
  }, [text, speed, delay, isClient]);

  if (!isClient) {
    return <span className={className}>&nbsp;</span>;
  }

  return (
    <span className={className}>
      <span>{displayedText}</span>
      {isClient && isTyping && !stopBlinkingOnEnd && <span className="cursor-blink">_</span>}
    </span>
  );
};
