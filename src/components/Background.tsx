import React from 'react';
import { CONFIG } from '../config';

interface BackgroundProps {
  isPlaying?: boolean;
  customImageUrl?: string;
}

export const Background: React.FC<BackgroundProps> = React.memo(({ 
  isPlaying = false, 
  customImageUrl 
}) => {
  const imageUrl = customImageUrl || CONFIG.backgroundImage;

  return (
    <div className="background-container" aria-hidden="true">
      {/* 1. Cinematic Background Image with Ultra-Subtle Ambient Drift */}
      <div className={`background-image-frame ${isPlaying ? 'is-playing' : ''}`}>
        <img
          src={imageUrl}
          alt="Shreya Ghoshal"
          className="background-image"
          loading="eager"
          decoding="async"
          // @ts-expect-error React 18 fetchPriority support
          fetchpriority="high"
        />
      </div>

      {/* 2. Soft Dynamic Spotlight preserving subject face illumination */}
      <div className="bg-subject-spotlight" />

      {/* 3. Dark Cinematic Gradients for negative space balance & readability */}
      <div className="bg-gradient-top" />
      <div className="bg-gradient-bottom" />
      <div className="bg-gradient-radial" />

      {/* 4. Ambient Aura / Gold Stage Lighting */}
      <div className={`bg-ambient-aura ${isPlaying ? 'active' : ''}`} />

      {/* 5. Subtle Vignette & Film Grain Texture */}
      <div className="vignette-overlay" />
      <div className="film-grain-overlay" />
    </div>
  );
});

Background.displayName = 'Background';
