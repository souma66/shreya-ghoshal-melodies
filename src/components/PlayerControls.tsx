import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = React.memo(({
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="player-controls-container" role="toolbar" aria-label="Playback controls">
      {/* 1. Previous Track Button */}
      <button
        type="button"
        className="nav-control-btn prev-btn"
        onClick={onPrevious}
        aria-label="Previous track"
        title="Previous track"
      >
        <SkipBack size={20} className="nav-icon" aria-hidden="true" />
      </button>

      {/* 2. Hero Play / Pause Centerpiece Button */}
      <button
        type="button"
        className={`hero-play-button ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        <span className="hero-play-halo" aria-hidden="true" />
        <span className="hero-play-disc">
          {isPlaying ? (
            <Pause size={24} className="play-icon-glyph pause-glyph" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={24} className="play-icon-glyph play-glyph" fill="currentColor" aria-hidden="true" />
          )}
        </span>
      </button>

      {/* 3. Next Track Button */}
      <button
        type="button"
        className="nav-control-btn next-btn"
        onClick={onNext}
        aria-label="Next track"
        title="Next track"
      >
        <SkipForward size={20} className="nav-icon" aria-hidden="true" />
      </button>
    </div>
  );
});

PlayerControls.displayName = 'PlayerControls';
