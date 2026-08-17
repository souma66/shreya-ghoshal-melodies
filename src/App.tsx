import React, { useEffect } from 'react';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { ArtistVisual } from './components/ArtistVisual';
import { Branding } from './components/Branding';
import { MusicPlayer } from './components/MusicPlayer';
import './App.css';

export const App: React.FC = () => {
  const {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrack,
    errorMessage,
    togglePlay,
    next,
    previous,
    seek,
    setVolumeLevel,
    toggleMute,
  } = useYouTubePlayer();

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyN':
          e.preventDefault();
          next();
          break;
        case 'KeyP':
          e.preventDefault();
          previous();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 5));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolumeLevel(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolumeLevel(Math.max(0, volume - 0.05));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [togglePlay, next, previous, toggleMute, seek, setVolumeLevel, duration, currentTime, volume]);

  return (
    <div className="shreya-melodies-app">
      {/* 1. Full-Screen Artist Visual & Ambient Stage */}
      <ArtistVisual isPlaying={isPlaying} />

      {/* 2. Main Minimalist Listening Sanctuary Interface */}
      <div className="listening-room-shell">
        {/* Top Semantic Brand Header */}
        <Branding />

        {/* Central / Lower Music Player */}
        <MusicPlayer
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          currentTrack={currentTrack}
          errorMessage={errorMessage}
          onTogglePlay={togglePlay}
          onPrevious={previous}
          onNext={next}
          onSeek={seek}
          onVolumeChange={setVolumeLevel}
          onToggleMute={toggleMute}
        />

        {/* Semantic Footer with Subtle Visible SEO Description */}
        <footer className="room-footer" role="contentinfo">
          <p className="footer-seo-description">
            Shreya Ghoshal Melodies is a cinematic listening experience celebrating the voice and music of Shreya Ghoshal.
          </p>
          <p className="footer-text">
            IMMERSIVE HIGH-FIDELITY AUDIO • ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
