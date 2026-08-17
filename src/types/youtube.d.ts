declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    loop?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    origin?: string;
    list?: string;
    listType?: 'playlist' | 'search' | 'user_uploads';
    [key: string]: any;
  }

  interface PlayerOptions {
    width?: string | number;
    height?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: any) => void;
      onPlaybackRateChange?: (event: any) => void;
      onError?: (event: OnErrorEvent) => void;
      onApiChange?: (event: any) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: PlayerState;
  }

  interface OnErrorEvent {
    target: Player;
    data: number;
  }

  interface VideoData {
    video_id?: string;
    author?: string;
    title?: string;
    isPlayable?: boolean;
    errorCode?: any;
    [key: string]: any;
  }

  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    setSize(width: number, height: number): object;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    setLoop(loopPlaylists: boolean): void;
    setShuffle(shufflePlaylist: boolean): void;
    getVideoLoadedFraction(): number;
    getPlayerState(): PlayerState;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    getVideoData(): VideoData;
    loadPlaylist(playlist: string[] | { list: string; listType?: string; index?: number; startSeconds?: number }, index?: number, startSeconds?: number): void;
    cuePlaylist(playlist: string[] | { list: string; listType?: string; index?: number; startSeconds?: number }, index?: number, startSeconds?: number): void;
    destroy(): void;
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
  }
}

interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT?: typeof YT;
}
