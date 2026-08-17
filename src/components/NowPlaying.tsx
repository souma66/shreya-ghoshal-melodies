import React from 'react';
import { TrackInfo } from '../types';

interface NowPlayingProps {
  currentTrack: TrackInfo;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  errorMessage: string | null;
}

export const NowPlaying: React.FC<NowPlayingProps> = React.memo(({
  currentTrack,
  isPlaying,
  isBuffering,
  currentTime,
  errorMessage,
}) => {
  const isInitial = !isPlaying && currentTime === 0;

  return (
    <div className="now-playing-block">
      {/* 1. Header Label: NOW PLAYING / TAP TO PLAY */}
      <div className="now-playing-label-row">
        <span className="now-playing-gold-dot" aria-hidden="true" />
        <span className="now-playing-label">
          {isInitial ? 'TAP TO PLAY' : isBuffering ? 'BUFFERING' : 'NOW PLAYING'}
        </span>
      </div>

      {/* 2. Error Notice (if needed) */}
      {errorMessage && (
        <div className="player-inline-notice" role="alert">
          {errorMessage}
        </div>
      )}

      {/* 3. Typographic Hierarchy: [Song Title] & SHREYA GHOSHAL */}
      <div className="now-playing-content" key={currentTrack?.id || currentTrack?.title}>
        <h2 className="now-playing-song-title" title={currentTrack?.title || 'Shreya Ghoshal'}>
          {currentTrack?.title || 'Shreya Ghoshal Melodies'}
        </h2>
        <p className="now-playing-artist-name">
          {currentTrack?.album ? `${currentTrack.album} • ` : ''}SHREYA GHOSHAL
        </p>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
