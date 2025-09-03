
"use client";

import React, { useState, useEffect } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({ text, speed = 20, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !text) return;
    
    setDisplayedText(''); // Reset on text change

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
    // Render nothing on the server to avoid mismatch
    return <span className={className}></span>;
  }

  return (
    <span className={className}>
      <span>{displayedText}</span>
      {/* Only show cursor if typing is in progress */}
      {isClient && displayedText.length < text.length && <span className="cursor-blink">_</span>}
    </span>
  );
};
