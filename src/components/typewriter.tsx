"use client";

import React, { useState, useEffect, useRef } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({ text, speed = 2, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  // Create a temporary element to strip HTML for length calculation
  const strippedText = (() => {
    if (typeof window === 'undefined') return text;
    const temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.textContent || temp.innerText || '';
  })();
  
  const textLength = strippedText.length;

  useEffect(() => {
    const timer = setTimeout(() => {
        setStartTyping(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;
    
    setDisplayedText(''); // Reset on text change after delay
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < textLength) {
        // Use original text with HTML for rendering
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        // Ensure the final state includes all HTML
        setDisplayedText(text);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed, startTyping, textLength]);
  
  // Check if final text is fully displayed
  const isCompleted = (() => {
    const temp1 = document.createElement('div');
    temp1.innerHTML = displayedText;
    const temp2 = document.createElement('div');
    temp2.innerHTML = text;
    return temp1.textContent === temp2.textContent;
  })();

  return (
    <span ref={containerRef} className={className}>
      <span dangerouslySetInnerHTML={{ __html: displayedText }} />
      {!isCompleted && <span className="cursor-blink">_</span>}
    </span>
  );
};
