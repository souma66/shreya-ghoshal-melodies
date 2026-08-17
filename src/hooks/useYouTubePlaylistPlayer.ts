import { useState, useEffect, useRef, useCallback } from 'react';
import { TrackInfo } from '../types';

export interface ShreyaTrack {
  id: string;
  title: string;
  album: string;
  artist: string;
  duration: number; // in seconds
  audioUrl: string;
}

// 16 Curated 100% Pure Solo Shreya Ghoshal Masterpieces
export const SHREYA_SOLO_TRACKS: ShreyaTrack[] = [
  {
    id: 'deewani_mastani',
    title: 'Deewani Mastani',
    album: 'Bajirao Mastani',
    artist: 'Shreya Ghoshal',
    duration: 35,
    audioUrl: '/audio/deewani_mastani.wav',
  },
  {
    id: 'sunn_raha_hai',
    title: 'Sunn Raha Hai Na Tu (Female Version)',
    album: 'Aashiqui 2',
    artist: 'Shreya Ghoshal',
    duration: 35,
    audioUrl: '/audio/sunn_raha_hai.wav',
  },
  {
    id: 'barso_re',
    title: 'Barso Re',
    album: 'Guru',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/barso_re.wav',
  },
  {
    id: 'yeh_ishq_hai',
    title: 'Yeh Ishq Hai',
    album: 'Jab We Met',
    artist: 'Shreya Ghoshal',
    duration: 30,
    audioUrl: '/audio/yeh_ishq_hai.wav',
  },
  {
    id: 'mohe_rang_do_laal',
    title: 'Mohe Rang Do Laal',
    album: 'Bajirao Mastani',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/mohe_rang_do_laal.wav',
  },
  {
    id: 'jaadu_hai_nasha_hai',
    title: 'Jaadu Hai Nasha Hai',
    album: 'Jism',
    artist: 'Shreya Ghoshal',
    duration: 34,
    audioUrl: '/audio/jaadu_hai_nasha_hai.wav',
  },
  {
    id: 'chalo_tumko_lekar',
    title: 'Chalo Tumko Lekar Chale',
    album: 'Jism',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/chalo_tumko_lekar.wav',
  },
  {
    id: 'rozana',
    title: 'Rozana',
    album: 'Naam Shabana',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/rozana.wav',
  },
  {
    id: 'chikni_chameli',
    title: 'Chikni Chameli',
    album: 'Agneepath',
    artist: 'Shreya Ghoshal',
    duration: 30,
    audioUrl: '/audio/chikni_chameli.wav',
  },
  {
    id: 'leja_leja_re',
    title: 'Leja Leja Re',
    album: 'Ustad & The Divas',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/leja_leja_re.wav',
  },
  {
    id: 'aadha_ishq',
    title: 'Aadha Ishq',
    album: 'Band Baaja Baaraat',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/aadha_ishq.wav',
  },
  {
    id: 'jhalla_wallah',
    title: 'Jhalla Wallah',
    album: 'Ishaqzaade',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/jhalla_wallah.wav',
  },
  {
    id: 'nagada_sang_dhol',
    title: 'Nagada Sang Dhol',
    album: 'Goliyon Ki Raasleela Ram-Leela',
    artist: 'Shreya Ghoshal',
    duration: 30,
    audioUrl: '/audio/nagada_sang_dhol.wav',
  },
  {
    id: 'ghoomar',
    title: 'Ghoomar',
    album: 'Padmaavat',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/ghoomar.wav',
  },
  {
    id: 'silsila_ye_chahat',
    title: 'Silsila Ye Chahat Ka',
    album: 'Devdas',
    artist: 'Shreya Ghoshal',
    duration: 32,
    audioUrl: '/audio/silsila_ye_chahat.wav',
  },
  {
    id: 'agar_tum_mil_jao',
    title: 'Agar Tum Mil Jao (Female Version)',
    album: 'Zeher',
    artist: 'Shreya Ghoshal',
    duration: 34,
    audioUrl: '/audio/agar_tum_mil_jao.wav',
  },
];

interface UseYouTubePlaylistPlayerReturn {
  isPlayerReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentTrack: TrackInfo;
  errorMessage: string | null;
  initializeAndPlay: () => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
}

export function useYouTubePlaylistPlayer(): UseYouTubePlaylistPlayerReturn {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SHREYA_SOLO_TRACKS[0].duration);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const isPlayerReady = true;
  const isBuffering = false;
  const errorMessage = null;

  const currentSong = SHREYA_SOLO_TRACKS[trackIndex] || SHREYA_SOLO_TRACKS[0];

  const currentTrack: TrackInfo = {
    id: currentSong.id,
    title: currentSong.title,
    artist: currentSong.artist,
    album: currentSong.album,
    duration: currentSong.duration,
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const trackIndexRef = useRef(0);
  const volumeRef = useRef(0.85);
  const isMutedRef = useRef(false);

  // Synchronize state references
  useEffect(() => {
    trackIndexRef.current = trackIndex;
    setDuration(currentSong.duration);
  }, [trackIndex, currentSong.duration]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : volume;
    }
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = isMuted ? 0 : volumeRef.current;
    }
  }, [isMuted]);

  // Load and play a specific track index
  const playTrackAtIndex = useCallback((index: number) => {
    const targetSong = SHREYA_SOLO_TRACKS[index];
    if (!targetSong) return;

    setTrackIndex(index);
    trackIndexRef.current = index;
    setCurrentTime(0);

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;
    audio.src = targetSong.audioUrl;
    audio.currentTime = 0;
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audio.muted = isMutedRef.current;

    audio.play().then(() => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    }).catch(err => {
      console.warn('Playback gesture wait:', err);
    });
  }, []);

  // Automatic Next Track progression
  const handleNextTrack = useCallback(() => {
    const nextIndex = (trackIndexRef.current + 1) % SHREYA_SOLO_TRACKS.length;
    playTrackAtIndex(nextIndex);
  }, [playTrackAtIndex]);

  // Initialize Native Audio Element on Mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = SHREYA_SOLO_TRACKS[0].audioUrl;
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      }
    };

    const onEnded = () => {
      // Automatically advance to the next song!
      handleNextTrack();
    };

    const onPlay = () => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    };

    const onPause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, [handleNextTrack]);

  // 1. Initialize and Play (ENTER button)
  const initializeAndPlay = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SHREYA_SOLO_TRACKS[0].audioUrl);
    }
    const audio = audioRef.current;
    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audio.muted = isMutedRef.current;
    audio.play().then(() => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    }).catch(() => {
      setIsPlaying(true);
    });
  }, []);

  // 2. Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      playTrackAtIndex(trackIndexRef.current);
      return;
    }
    const audio = audioRef.current;
    if (audio.paused) {
      audio.volume = isMutedRef.current ? 0 : volumeRef.current;
      audio.play().then(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
      }).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [playTrackAtIndex]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, []);

  // 3. Next Song (also plays automatically on end)
  const next = useCallback(() => {
    handleNextTrack();
  }, [handleNextTrack]);

  // 4. Previous Song
  const previous = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 4) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prevIndex = (trackIndexRef.current - 1 + SHREYA_SOLO_TRACKS.length) % SHREYA_SOLO_TRACKS.length;
      playTrackAtIndex(prevIndex);
    }
  }, [playTrackAtIndex]);

  // 5. Seek to Time
  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  // 6. Volume Level (0 to 1)
  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.min(1, Math.max(0, vol));
    setVolume(clamped);
    volumeRef.current = clamped;
    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : clamped;
      if (isMutedRef.current && clamped > 0) {
        setIsMuted(false);
        isMutedRef.current = false;
        audioRef.current.muted = false;
      }
    }
  }, []);

  // 7. Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const willMute = !prev;
      isMutedRef.current = willMute;
      if (audioRef.current) {
        audioRef.current.muted = willMute;
        audioRef.current.volume = willMute ? 0 : volumeRef.current;
      }
      return willMute;
    });
  }, []);

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
    initializeAndPlay,
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
