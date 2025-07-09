import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface PlayerBarProps {
  onNowPlayingClick?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ onNowPlayingClick }) => {
  const { playerState, playPause, nextSong, previousSong, setVolume, setCurrentTime, toggleRepeat, toggleShuffle } = usePlayer();
  const { theme } = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * playerState.duration;
    setCurrentTime(newTime);
  };

  if (!playerState.currentSong) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 md:bottom-0 border-t border-opacity-20 backdrop-blur-lg p-4"
      style={{ 
        backgroundColor: theme.secondary + 'F0',
        borderColor: theme.text,
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <button
            onClick={onNowPlayingClick}
            className="flex items-center space-x-3 hover:bg-opacity-10 rounded-lg p-2 transition-colors flex-1 min-w-0"
            style={{ backgroundColor: 'transparent' }}
          >
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
              {playerState.currentSong.thumbnail ? (
                <img
                  src={playerState.currentSong.thumbnail}
                  alt={playerState.currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                >
                  <span className="text-white text-lg font-bold">
                    {playerState.currentSong.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <h4
                className="font-medium truncate"
                style={{ color: theme.text }}
              >
                {playerState.currentSong.title}
              </h4>
              <p
                className="text-sm opacity-70 truncate"
                style={{ color: theme.text }}
              >
                {playerState.currentSong.artist}
              </p>
            </div>
          </button>
          <button 
            className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
            style={{ color: theme.text }}
          >
            <Heart size={20} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ 
                color: playerState.shuffle ? theme.primary : theme.text + '80' 
              }}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={previousSong}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ color: theme.text }}
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={playPause}
              className="p-3 rounded-full transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: theme.primary,
                color: theme.isDark ? '#000' : '#fff'
              }}
            >
              {playerState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={nextSong}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ color: theme.text }}
            >
              <SkipForward size={20} />
            </button>
            <button
              onClick={toggleRepeat}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ 
                color: playerState.repeat ? theme.primary : theme.text + '80' 
              }}
            >
              <Repeat size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span 
              className="text-xs opacity-70"
              style={{ color: theme.text }}
            >
              {formatTime(playerState.currentTime)}
            </span>
            <div 
              className="flex-1 h-1 bg-opacity-20 rounded-full cursor-pointer"
              style={{ backgroundColor: theme.text }}
              onClick={handleProgressClick}
            >
              <div 
                className="h-full rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: theme.primary,
                  width: `${(playerState.currentTime / playerState.duration) * 100}%`
                }}
              />
            </div>
            <span 
              className="text-xs opacity-70"
              style={{ color: theme.text }}
            >
              {formatTime(playerState.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="relative">
            <button
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ color: theme.text }}
            >
              <Volume2 size={20} />
            </button>
            {showVolumeSlider && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 rounded-lg backdrop-blur-lg"
                style={{ backgroundColor: theme.secondary + 'E6' }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={playerState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: theme.text }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;