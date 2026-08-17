import React, { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';

interface IntroScreenProps {
  onEnter: () => void;
  isOpen: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter, isOpen }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleEnterClick = useCallback(() => {
    // 1. Immediately invoke onEnter synchronously on click to satisfy browser audio gesture policy!
    onEnter();
    setIsExiting(true);

    // 2. Unmount intro screen after smooth visual fade-out
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  }, [onEnter]);

  useEffect(() => {
    if (!isOpen || isDismissed || isExiting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleEnterClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDismissed, isExiting, handleEnterClick]);

  if (isDismissed || !isOpen) return null;

  return (
    <div
      className={`intro-screen-overlay ${isExiting ? 'intro-fade-out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-artist-title"
    >
      <div className="intro-content">
        {/* Subtle Room Insignia */}
        <div className="intro-tag">
          <span className="intro-tag-dot" />
          <span>{CONFIG.roomTag}</span>
        </div>

        {/* Artist Title */}
        <h1 id="intro-artist-title" className="intro-artist-name text-gold-shimmer">
          {CONFIG.artistName}
        </h1>

        {/* Subtitle */}
        <p className="intro-subtitle">
          {CONFIG.subtitle}
        </p>

        {/* Minimalist Divider */}
        <div className="intro-gold-line" />

        {/* Luxury ENTER Button */}
        <button
          id="enter-room-btn"
          className="intro-enter-btn"
          onClick={handleEnterClick}
          autoFocus
          aria-label="Enter Shreya Ghoshal's Listening Room"
        >
          <span className="enter-btn-bg" />
          <span className="enter-btn-glow" />
          <span className="enter-btn-label">ENTER</span>
        </button>
      </div>
    </div>
  );
};
