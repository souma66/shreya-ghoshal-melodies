export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
}

export interface PlayerState {
  isPlayerReady: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  currentTrack: TrackInfo;
  errorMessage: string | null;
}
