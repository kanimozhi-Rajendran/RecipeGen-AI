import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analyzing your pantry ingredients...',
  'Balancing flavor profiles and culinary pairings...',
  'Crafting step-by-step instructions with AI...',
  'Optimizing cooking time and ingredient substitutions...',
  'Plating your delicious custom recipes...'
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="spinner-orbit">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <h3 className="loading-text">Chef AI is Cooking Up Ideas...</h3>
      <p className="loading-subtext">{LOADING_MESSAGES[messageIndex]}</p>
    </div>
  );
}
