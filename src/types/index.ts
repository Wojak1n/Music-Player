export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  thumbnail?: string;
  lyrics?: string;
  source: 'local' | 'youtube';
  uploadedAt: Date;
  likedAt?: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  backgroundImage?: string;
  isDark: boolean;
}

export interface User {
  id: string;
  preferences: {
    theme: Theme;
    volume: number;
    repeat: boolean;
    shuffle: boolean;
  };
  playlists: Playlist[];
  history: Song[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeat: boolean;
  shuffle: boolean;
  queue: Song[];
  currentIndex: number;
}