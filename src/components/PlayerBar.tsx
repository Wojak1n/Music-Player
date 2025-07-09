import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Repeat, Shuffle, Heart, X } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface PlayerBarProps {
  onNowPlayingClick: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ onNowPlayingClick }) => {
  const { playerState, playPause, nextSong, previousSong, setVolume, setCurrentTime, toggleRepeat, toggleShuffle } = usePlayer();
  const { theme } = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlayerBarHidden, setIsPlayerBarHidden] = useState(false);

  useEffect(() => {
    if (playerState.currentSong && !isPlayerBarHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [playerState.currentSong, isPlayerBarHidden]);

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

  const handleClosePlayer = () => {
    console.log('Close player button clicked!');
    setIsPlayerBarHidden(true);
  };

  const handleShowPlayer = () => {
    console.log('Show player button clicked!');
    setIsPlayerBarHidden(false);
  };

  const toggleMute = () => {
    if (playerState.volume > 0) {
      setPreviousVolume(playerState.volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  const getVolumeIcon = () => {
    if (playerState.volume === 0) {
      return <VolumeX size={20} />;
    } else if (playerState.volume < 0.5) {
      return <Volume1 size={20} />;
    } else {
      return <Volume2 size={20} />;
    }
  };

  if (!playerState.currentSong) {
    return null;
  }

  // If player is hidden, show a small restore button
  if (isPlayerBarHidden) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleShowPlayer}
          className="w-12 h-12 rounded-full shadow-lg backdrop-blur-lg border border-opacity-20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: theme.primary + 'E6',
            borderColor: theme.text + '20',
            color: theme.isDark ? '#000' : '#fff',
          }}
          title="Show Player"
        >
          <Play size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t border-opacity-20 backdrop-blur-lg p-4 z-40 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
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
            className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            {playerState.currentSong?.thumbnail ? (
              <img 
                src={playerState.currentSong.thumbnail} 
                alt={playerState.currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: theme.primary, color: theme.isDark ? '#000' : '#fff' }}
              >
                {playerState.currentSong?.title.charAt(0)}
              </div>
            )}
          </button>
          
          <div className="min-w-0 flex-1">
            <h3 
              className="font-semibold truncate"
              style={{ color: theme.text }}
            >
              {playerState.currentSong?.title}
            </h3>
            <p 
              className="text-sm opacity-70 truncate"
              style={{ color: theme.text }}
            >
              {playerState.currentSong?.artist}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
              style={{ color: playerState.shuffle ? theme.primary : theme.text + '60' }}
            >
              <Shuffle size={18} />
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
              className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all"
              style={{ backgroundColor: theme.primary, color: theme.isDark ? '#000' : '#fff' }}
            >
              {playerState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
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
              style={{ color: playerState.repeat ? theme.primary : theme.text + '60' }}
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span 
              className="text-xs opacity-70 min-w-[40px]"
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
              className="text-xs opacity-70 min-w-[40px]"
              style={{ color: theme.text }}
            >
              {formatTime(playerState.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control & Close Button */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="relative">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="p-2 hover:bg-opacity-10 rounded-full transition-all duration-200 hover:scale-110"
              style={{ color: playerState.volume === 0 ? '#ef4444' : theme.text }}
              title={playerState.volume === 0 ? 'Unmute' : 'Mute'}
            >
              {getVolumeIcon()}
            </button>

            {showVolumeSlider && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-3 rounded-lg backdrop-blur-lg border border-opacity-20 shadow-lg"
                style={{ 
                  backgroundColor: theme.secondary + 'F0',
                  borderColor: theme.text + '20'
                }}
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
                  className="w-20 h-2 bg-opacity-30 rounded-lg appearance-none cursor-pointer volume-slider"
                  style={{ backgroundColor: theme.text + '30' }}
                />
              </div>
            )}
          </div>

          {/* Close Player Button */}
          <button
            onClick={handleClosePlayer}
            className="ml-2 p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-colors border border-red-500 border-opacity-50"
            style={{ color: '#ef4444' }}
            title="Hide Player"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
