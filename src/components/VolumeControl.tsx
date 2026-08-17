import React, { useCallback, useRef, useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = React.memo(({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const displayVolume = isMuted ? 0 : volume;
  const volumePercent = Math.round(displayVolume * 100);

  const calculateVolumeFromEvent = useCallback((clientX: number): number => {
    if (!trackRef.current) return volume;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.max(0, Math.min(1, clickX / rect.width));
  }, [volume]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const newVol = calculateVolumeFromEvent(e.clientX);
    onVolumeChange(newVol);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [calculateVolumeFromEvent, onVolumeChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newVol = calculateVolumeFromEvent(e.clientX);
    onVolumeChange(newVol);
  }, [isDragging, calculateVolumeFromEvent, onVolumeChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      const newVol = calculateVolumeFromEvent(e.clientX);
      onVolumeChange(newVol);
    }
  }, [isDragging, calculateVolumeFromEvent, onVolumeChange]);

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onVolumeChange(Math.min(1, volume + 0.05));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onVolumeChange(Math.max(0, volume - 0.05));
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      onToggleMute();
    }
  }, [volume, onVolumeChange, onToggleMute]);

  const renderVolumeIcon = () => {
    if (isMuted || displayVolume === 0) {
      return <VolumeX size={17} className="volume-icon" aria-hidden="true" />;
    }
    if (displayVolume < 0.5) {
      return <Volume1 size={17} className="volume-icon" aria-hidden="true" />;
    }
    return <Volume2 size={17} className="volume-icon" aria-hidden="true" />;
  };

  return (
    <div className="volume-control-wrapper">
      {/* 1. Mute / Unmute Button */}
      <button
        type="button"
        className="volume-mute-btn"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {renderVolumeIcon()}
      </button>

      {/* 2. Slim Gold Volume Slider */}
      <div
        className="volume-track-container"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="slider"
        tabIndex={0}
        aria-label="Volume level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volumePercent}
        aria-valuetext={`${volumePercent}% volume`}
        onKeyDown={handleKeyDown}
      >
        <div className="volume-track-bg">
          <div
            className="volume-track-fill"
            style={{ width: `${volumePercent}%` }}
          >
            <div className="volume-thumb-glow" />
          </div>
        </div>
      </div>
    </div>
  );
});

VolumeControl.displayName = 'VolumeControl';
