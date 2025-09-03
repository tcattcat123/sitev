"use client";

import React, { useState, useEffect, useRef } from 'react';

export const Typewriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({ text, speed = 20, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
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
    
    setDisplayedText('');
    let i = 0;
    const typingInterval = setInterval(() => {
      let nextCharIndex = i;
      if (text[nextCharIndex] === '<') {
        while(text[nextCharIndex] !== '>' && nextCharIndex < text.length) {
          nextCharIndex++;
        }
      }

      const substringToShow = text.substring(0, nextCharIndex + 1);

      if (i < text.length) {
        setDisplayedText(substringToShow);
        i = nextCharIndex + 1;
      } else {
        clearInterval(typingInterval);
        setDisplayedText(text);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed, startTyping]);
  
  const isCompleted = (() => {
    if (typeof window === 'undefined') return displayedText === text;
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
