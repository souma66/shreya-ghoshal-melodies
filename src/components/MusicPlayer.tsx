import React from 'react';
import { TrackInfo } from '../types';
import { NowPlaying } from './NowPlaying';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

interface MusicPlayerProps {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentTrack: TrackInfo;
  errorMessage?: string | null;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = React.memo(({
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  volume,
  isMuted,
  currentTrack,
  errorMessage = null,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <main className="music-player-container" role="main" aria-label="Music Player">
      {/* Ambient Pulsing Aura behind player */}
      <div 
        className={`player-ambient-halo ${isPlaying ? 'halo-playing' : 'halo-idle'}`} 
        aria-hidden="true" 
      />

      {/* Main Luxury Glass Player Card */}
      <div className="music-player-card">
        {/* 1. CURRENTLY PLAYING + Dynamic Song Title */}
        <section className="player-track-section">
          <NowPlaying
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            currentTime={currentTime}
            errorMessage={errorMessage}
          />
        </section>

        {/* 2. Playback Controls (Previous, Hero Play/Pause, Next) */}
        <section className="player-controls-section">
          <PlayerControls
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </section>

        {/* 3. Sleek Progress Bar (Current Time ━━━━━━ Duration) */}
        <section className="player-progress-section">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </section>

        {/* 4. Minimalist Volume Slider (🔊 ━━━━━━) */}
        <section className="player-volume-section">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
        </section>
      </div>
    </main>
  );
});

MusicPlayer.displayName = 'MusicPlayer';
