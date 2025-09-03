"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

export const TextScramble: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [currentText, setCurrentText] = useState('');
  const textRef = useRef(text);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isRevealed, setIsRevealed] = useState(false);

  const scramble = useCallback(() => {
    setIsRevealed(false);
    let iteration = 0;
    const letters = "█▓▒░";

    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
        const newText = textRef.current
          .split("")
          .map((_letter, index) => {
            if (index < iteration) {
              return textRef.current[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
        
        setCurrentText(newText);
        
        if (iteration >= textRef.current.length) {
          clearInterval(intervalRef.current!);
          setIsRevealed(true);
        }
        
        iteration += 1 / 2;
      }, 60);
  }, []);

  useEffect(() => {
    textRef.current = text;
    scramble();
  }, [text, scramble]);

  useEffect(() => {
    const initialDelay = setTimeout(scramble, 500);
    return () => {
        clearTimeout(initialDelay);
        clearInterval(intervalRef.current!);
    }
  }, [scramble]);

  return (
    <>
      <span className={className}>{currentText}</span>
      {isRevealed && <span className="cursor-blink">_</span>}
    </>
  );
};
