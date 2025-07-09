import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song, PlayerState } from '../types';

interface PlayerContextType {
  playerState: PlayerState;
  audioRef: React.RefObject<HTMLAudioElement>;
  playPause: () => void;
  playSong: (song: Song, queue?: Song[]) => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    repeat: false,
    shuffle: false,
    queue: [],
    currentIndex: 0,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      if (playerState.repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    const handleLoadedData = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [playerState.repeat]);

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio || !playerState.currentSong) return;

    if (playerState.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const playSong = (song: Song, queue?: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlayerState(prev => ({
      ...prev,
      currentSong: song,
      queue: queue || [song],
      currentIndex: queue ? queue.findIndex(s => s.id === song.id) : 0,
      isPlaying: true,
    }));

    audio.src = song.url;
    audio.play();
  };

  const getNextIndex = () => {
    if (playerState.shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * playerState.queue.length);
      } while (nextIndex === playerState.currentIndex && playerState.queue.length > 1);
      return nextIndex;
    }
    return (playerState.currentIndex + 1) % playerState.queue.length;
  };

  const getPreviousIndex = () => {
    if (playerState.shuffle) {
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * playerState.queue.length);
      } while (prevIndex === playerState.currentIndex && playerState.queue.length > 1);
      return prevIndex;
    }
    return playerState.currentIndex === 0 
      ? playerState.queue.length - 1 
      : playerState.currentIndex - 1;
  };

  const nextSong = () => {
    if (playerState.queue.length === 0) return;
    
    const nextIndex = getNextIndex();
    const nextSong = playerState.queue[nextIndex];
    
    setPlayerState(prev => ({
      ...prev,
      currentSong: nextSong,
      currentIndex: nextIndex,
    }));

    const audio = audioRef.current;
    if (audio) {
      audio.src = nextSong.url;
      if (playerState.isPlaying) {
        audio.play();
      }
    }
  };

  const previousSong = () => {
    if (playerState.queue.length === 0) return;
    
    const prevIndex = getPreviousIndex();
    const prevSong = playerState.queue[prevIndex];
    
    setPlayerState(prev => ({
      ...prev,
      currentSong: prevSong,
      currentIndex: prevIndex,
    }));

    const audio = audioRef.current;
    if (audio) {
      audio.src = prevSong.url;
      if (playerState.isPlaying) {
        audio.play();
      }
    }
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const setCurrentTime = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  const toggleRepeat = () => {
    setPlayerState(prev => ({ ...prev, repeat: !prev.repeat }));
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const addToQueue = (song: Song) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
  };

  const removeFromQueue = (index: number) => {
    setPlayerState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index),
    }));
  };

  return (
    <PlayerContext.Provider value={{
      playerState,
      audioRef,
      playPause,
      playSong,
      nextSong,
      previousSong,
      setVolume,
      setCurrentTime,
      toggleRepeat,
      toggleShuffle,
      addToQueue,
      removeFromQueue,
    }}>
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};