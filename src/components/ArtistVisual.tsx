import React from 'react';
import shreyaCollageWebp from '../assets/shreya-bg.webp';
import shreyaCollageJpg from '../assets/shreya-bg.jpg';

interface ArtistVisualProps {
  isPlaying: boolean;
}

export const ArtistVisual: React.FC<ArtistVisualProps> = React.memo(({ isPlaying }) => {
  return (
    <div className="artist-visual-stage" aria-hidden="true">
      {/* 1. Ambient Background Layer (Fills entire screen in matching concert tones) */}
      <div className="artist-ambient-backdrop">
        <picture>
          <source srcSet={shreyaCollageWebp} type="image/webp" />
          <img
            src={shreyaCollageJpg}
            alt=""
            className="artist-backdrop-blur"
            aria-hidden="true"
          />
        </picture>
        <div className="artist-backdrop-scrim" />
      </div>

      {/* 2. High-Performance LCP Hero Image: 100% Complete Faces, Zero Crop, Crystal Clear WebP */}
      <div className={`artist-main-frame ${isPlaying ? 'is-playing' : ''}`}>
        <picture>
          <source srcSet={shreyaCollageWebp} type="image/webp" />
          <img
            src={shreyaCollageJpg}
            alt="Shreya Ghoshal — Shreya Ghoshal Melodies"
            className="artist-main-photo"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1920"
            height="1280"
          />
        </picture>
      </div>

      {/* 3. Subtle UI Legibility Gradient */}
      <div className="artist-ui-scrim" />
    </div>
  );
});

ArtistVisual.displayName = 'ArtistVisual';
