import { useState, useEffect, useRef, useCallback } from 'react';
import { TrackInfo } from '../types';
import { formatSongTitle } from '../utils/titleFormatter';

export const YOUTUBE_PLAYLIST_ID = 'PLBnOl6AjMRQ0';

export interface UseYouTubePlayerReturn {
  isPlayerReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentTrack: TrackInfo;
  errorMessage: string | null;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
}

export function useYouTubePlayer(): UseYouTubePlayerReturn {
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentTrack, setCurrentTrack] = useState<TrackInfo>({
    id: YOUTUBE_PLAYLIST_ID,
    title: 'Shreya Ghoshal Melodies',
    artist: 'Shreya Ghoshal',
    album: 'A Private Listening Room',
    duration: 0,
  });

  const isSeekingRef = useRef(false);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(0.85);
  const isMutedRef = useRef(false);
  const shouldPlayOnReady = useRef(false);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Synchronize current track title & duration from YouTube API
  const updateTrackInfo = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const data = playerRef.current.getVideoData?.();
      const vidDuration = playerRef.current.getDuration?.() || 0;

      if (data && data.title && data.title.trim().length > 0) {
        const formatted = formatSongTitle(data.title);
        setCurrentTrack({
          id: data.video_id || YOUTUBE_PLAYLIST_ID,
          title: formatted.title,
          artist: 'Shreya Ghoshal',
          album: formatted.subtitle || 'Shreya Ghoshal Melodies',
          duration: vidDuration,
        });
      }

      if (vidDuration > 0) {
        setDuration(vidDuration);
      }
    } catch {
      // Ignore API read exception
    }
  }, []);

  // Initialize YouTube IFrame Player ONCE using supported parameters
  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    // 1. Ensure clean single container exists for YouTube Player
    let container = document.getElementById('youtube-single-player-container') as HTMLDivElement;
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-single-player-container';
      container.setAttribute('aria-hidden', 'true');
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.width = '240px';
      container.style.height = '180px';
      container.style.opacity = '0.001';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';
      document.body.appendChild(container);
    }
    containerRef.current = container;
    container.innerHTML = '<div id="yt-single-iframe-element"></div>';

    const createPlayer = () => {
      if (!isMounted || playerRef.current) return;
      if (!window.YT || !window.YT.Player) return;

      const targetEl = document.getElementById('yt-single-iframe-element');
      if (!targetEl) return;

      try {
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

        // Standard, officially supported YouTube Player initialization
        playerRef.current = new window.YT.Player('yt-single-iframe-element', {
          width: '240',
          height: '180',
          playerVars: {
            listType: 'playlist',
            list: YOUTUBE_PLAYLIST_ID,
            autoplay: 0,
            enablejsapi: 1,
            playsinline: 1,
            rel: 0,
            origin: currentOrigin,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              setIsPlayerReady(true);
              try {
                event.target.unMute();
                event.target.setVolume(Math.round(volumeRef.current * 100));
                // Cue the official playlist starting at index 0
                event.target.cuePlaylist({
                  list: YOUTUBE_PLAYLIST_ID,
                  listType: 'playlist',
                  index: 0,
                });
              } catch {}

              updateTrackInfo();

              if (shouldPlayOnReady.current) {
                try {
                  event.target.unMute();
                  event.target.playVideo();
                } catch {}
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return;

              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  setIsPlaying(true);
                  setIsBuffering(false);
                  setErrorMessage(null);
                  updateTrackInfo();
                  break;

                case window.YT.PlayerState.PAUSED:
                  setIsPlaying(false);
                  setIsBuffering(false);
                  break;

                case window.YT.PlayerState.BUFFERING:
                  setIsBuffering(true);
                  updateTrackInfo();
                  break;

                case window.YT.PlayerState.ENDED:
                  setIsPlaying(false);
                  setCurrentTime(0);
                  // Automatic sequential playback across the entire playlist
                  setTimeout(() => {
                    try {
                      playerRef.current?.nextVideo();
                    } catch {}
                  }, 100);
                  break;

                case window.YT.PlayerState.CUED:
                case window.YT.PlayerState.UNSTARTED:
                  setIsBuffering(false);
                  updateTrackInfo();
                  if (shouldPlayOnReady.current && !isPlayingRef.current) {
                    try {
                      playerRef.current?.unMute();
                      playerRef.current?.playVideo();
                    } catch {}
                  }
                  break;

                default:
                  break;
              }
            },
            onError: (event) => {
              if (!isMounted) return;
              console.warn('YouTube playlist track notice:', event?.data);
              setErrorMessage('Unable to play this track');
              // Automatically advance to the next available playlist item
              setTimeout(() => {
                try {
                  setErrorMessage(null);
                  playerRef.current?.nextVideo();
                } catch {}
              }, 600);
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube player:', err);
        setErrorMessage('Music is temporarily unavailable.');
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existing = document.getElementById('youtube-iframe-api-script');
      if (!existing) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        if (isMounted) createPlayer();
      };

      pollInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          if (pollInterval) clearInterval(pollInterval);
          if (isMounted) createPlayer();
        }
      }, 50);
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [updateTrackInfo]);

  // Polling loop for current playback time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isPlaying && isPlayerReady) {
      interval = setInterval(() => {
        if (!playerRef.current || isSeekingRef.current) return;

        try {
          const cur = playerRef.current.getCurrentTime?.() || 0;
          const tot = playerRef.current.getDuration?.() || 0;

          setCurrentTime(cur);
          if (tot > 0 && tot !== duration) {
            setDuration(tot);
          }
        } catch {}
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPlayerReady, duration]);

  // Controls calling official API
  const togglePlay = useCallback(() => {
    if (!playerRef.current) {
      shouldPlayOnReady.current = !isPlaying;
      return;
    }
    try {
      if (isPlaying) {
        shouldPlayOnReady.current = false;
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        shouldPlayOnReady.current = true;
        playerRef.current.unMute();
        playerRef.current.setVolume(Math.round(volumeRef.current * 100));
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {
      // Fallback
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    shouldPlayOnReady.current = true;
    if (playerRef.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(Math.round(volumeRef.current * 100));
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch {}
    }
  }, []);

  const pause = useCallback(() => {
    shouldPlayOnReady.current = false;
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch {}
    }
  }, []);

  const next = useCallback(() => {
    if (!playerRef.current) return;
    try {
      setCurrentTime(0);
      playerRef.current.nextVideo();
    } catch {}
  }, []);

  const previous = useCallback(() => {
    if (!playerRef.current) return;
    try {
      // If position > 5 seconds, restart current track; otherwise previous playlist item
      if (currentTime > 5) {
        playerRef.current.seekTo(0, true);
        setCurrentTime(0);
      } else {
        setCurrentTime(0);
        playerRef.current.previousVideo();
      }
    } catch {}
  }, [currentTime]);

  const seek = useCallback((seconds: number) => {
    if (!playerRef.current) return;
    isSeekingRef.current = true;
    setCurrentTime(seconds);
    try {
      playerRef.current.seekTo(seconds, true);
    } catch {}
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 300);
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.min(1, Math.max(0, vol));
    setVolume(clamped);
    volumeRef.current = clamped;
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(Math.round(clamped * 100));
        if (isMutedRef.current && clamped > 0) {
          playerRef.current.unMute();
          setIsMuted(false);
          isMutedRef.current = false;
        }
      } catch {}
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
        isMutedRef.current = false;
      } else {
        playerRef.current.mute();
        setIsMuted(true);
        isMutedRef.current = true;
      }
    } catch {}
  }, [isMuted]);

  return {
    isPlayerReady,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrack,
    errorMessage,
    togglePlay,
    play,
    pause,
    next,
    previous,
    seek,
    setVolumeLevel,
    toggleMute,
  };
}
