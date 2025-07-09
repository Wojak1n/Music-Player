import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Heart, 
  MoreHorizontal,
  ChevronDown,
  Share,
  ListMusic,
  Mic2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';

interface NowPlayingPageProps {
  onBackClick?: () => void;
}

const NowPlayingPage: React.FC<NowPlayingPageProps> = ({ onBackClick }) => {
  const { theme } = useTheme();
  const { 
    playerState, 
    playPause, 
    nextSong, 
    previousSong, 
    setVolume, 
    setCurrentTime, 
    toggleRepeat, 
    toggleShuffle 
  } = usePlayer();
  
  const [showVolume, setShowVolume] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const { currentSong, isPlaying, volume, currentTime, duration, repeat, shuffle, queue } = playerState;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mb-4 mx-auto flex items-center justify-center"
            style={{ backgroundColor: theme.secondary }}
          >
            <ListMusic size={32} style={{ color: theme.text }} className="opacity-50" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
            No song playing
          </h2>
          <p className="opacity-60" style={{ color: theme.text }}>
            Select a song to start listening
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackClick}
          className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
          style={{ color: theme.text }}
        >
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-sm opacity-60" style={{ color: theme.text }}>
            PLAYING FROM LIBRARY
          </p>
        </div>
        <button className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
          style={{ color: theme.text }}
        >
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Album Art */}
      <div className="aspect-square rounded-lg mb-8 shadow-2xl overflow-hidden">
        {currentSong.thumbnail ? (
          <img 
            src={currentSong.thumbnail} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <span className="text-white text-6xl font-bold">
              {currentSong.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2 truncate" style={{ color: theme.text }}>
          {currentSong.title}
        </h1>
        <p className="text-lg opacity-70 truncate" style={{ color: theme.text }}>
          {currentSong.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="w-full h-1 rounded-full cursor-pointer mb-2"
          style={{ backgroundColor: theme.secondary }}
          onClick={handleProgressClick}
        >
          <div 
            className="h-full rounded-full transition-all duration-100"
            style={{ 
              backgroundColor: theme.primary,
              width: `${duration ? (currentTime / duration) * 100 : 0}%`
            }}
          />
        </div>
        <div className="flex justify-between text-sm opacity-60" style={{ color: theme.text }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition-all duration-200 ${
            shuffle ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: shuffle ? theme.primary : theme.text }}
        >
          <Shuffle size={20} />
        </button>

        <button
          onClick={previousSong}
          className="p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: theme.text }}
        >
          <SkipBack size={28} />
        </button>

        <button
          onClick={playPause}
          className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          style={{ backgroundColor: theme.primary }}
        >
          {isPlaying ? (
            <Pause size={24} fill="white" color="white" />
          ) : (
            <Play size={24} fill="white" color="white" />
          )}
        </button>

        <button
          onClick={nextSong}
          className="p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: theme.text }}
        >
          <SkipForward size={28} />
        </button>

        <button
          onClick={toggleRepeat}
          className={`p-2 rounded-full transition-all duration-200 ${
            repeat ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: repeat ? theme.primary : theme.text }}
        >
          <Repeat size={20} />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-full transition-all duration-200 ${
            isLiked ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: isLiked ? theme.primary : theme.text }}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        <button
          className="p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: theme.text }}
        >
          <Share size={20} />
        </button>

        <button
          className="p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: theme.text }}
        >
          <Mic2 size={20} />
        </button>

        <button
          onClick={() => setShowQueue(!showQueue)}
          className="p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: theme.text }}
        >
          <ListMusic size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: theme.text }}
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          {showVolume && (
            <div 
              className="absolute bottom-12 right-0 p-4 rounded-lg shadow-lg"
              style={{ backgroundColor: theme.secondary }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${volume * 100}%, ${theme.secondary} ${volume * 100}%, ${theme.secondary} 100%)`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Queue (if shown) */}
      {showQueue && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
          onClick={() => setShowQueue(false)}
        >
          <div 
            className="w-full max-h-96 rounded-t-lg p-6 overflow-y-auto"
            style={{ backgroundColor: theme.background }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
              Up Next
            </h3>
            <div className="space-y-2">
              {queue.slice(playerState.currentIndex + 1).map((song, index) => (
                <div key={song.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-10"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <div className="w-10 h-10 rounded overflow-hidden">
                    {song.thumbnail ? (
                      <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <span className="text-white text-xs font-bold">
                          {song.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: theme.text }}>
                      {song.title}
                    </p>
                    <p className="text-sm opacity-70 truncate" style={{ color: theme.text }}>
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NowPlayingPage;
