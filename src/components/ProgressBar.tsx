import React, { useRef, useState, useCallback } from 'react';
import { formatTime } from '../utils/titleFormatter';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  currentTime,
  duration,
  onSeek,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 0;
  const effectiveTime = isDragging && dragTime !== null ? dragTime : currentTime;
  const progressPercent = safeDuration > 0 ? Math.min(100, Math.max(0, (effectiveTime / safeDuration) * 100)) : 0;

  const calculateSecondsFromEvent = useCallback((clientX: number): number => {
    if (!trackRef.current || safeDuration <= 0) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = offsetX / rect.width;
    return percentage * safeDuration;
  }, [safeDuration]);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (safeDuration <= 0) return;
    setIsDragging(true);
    const targetSeconds = calculateSecondsFromEvent(e.clientX);
    setDragTime(targetSeconds);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [safeDuration, calculateSecondsFromEvent]);

  // Pointer Move (Mouse Drag or Touch Move)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || safeDuration <= 0) return;
    const targetSeconds = calculateSecondsFromEvent(e.clientX);
    setDragTime(targetSeconds);
  }, [isDragging, safeDuration, calculateSecondsFromEvent]);

  // Pointer Up / End
  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      const targetSeconds = calculateSecondsFromEvent(e.clientX);
      setDragTime(null);
      onSeek(targetSeconds);
    }
  }, [isDragging, calculateSecondsFromEvent, onSeek]);

  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
    setDragTime(null);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (safeDuration <= 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSeek(Math.min(safeDuration, currentTime + 5));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSeek(Math.max(0, currentTime - 5));
    }
  }, [safeDuration, currentTime, onSeek]);

  return (
    <div className="progress-bar-wrapper">
      {/* 1. Elapsed Time */}
      <span className="time-display time-current" aria-label="Current playback time">
        {formatTime(effectiveTime)}
      </span>

      {/* 2. Interactive Drag & Click Scrubber Track */}
      <div
        className={`progress-track-container ${isDragging ? 'is-scrubbing' : ''}`}
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="slider"
        tabIndex={0}
        aria-label="Audio progress scrubber"
        aria-valuemin={0}
        aria-valuemax={Math.round(safeDuration)}
        aria-valuenow={Math.round(effectiveTime)}
        aria-valuetext={`${formatTime(effectiveTime)} of ${formatTime(safeDuration)}`}
        onKeyDown={handleKeyDown}
      >
        <div className="progress-track-bg">
          <div
            className="progress-track-fill"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="progress-thumb-glow" />
          </div>
        </div>
      </div>

      {/* 3. Total Duration */}
      <span className="time-display time-duration" aria-label="Total song duration">
        {formatTime(safeDuration)}
      </span>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
