import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface MobileNowPlayingProps {
  onNowPlayingClick: () => void;
}

const MobileNowPlaying: React.FC<MobileNowPlayingProps> = ({ onNowPlayingClick }) => {
  const { playerState, playPause } = usePlayer();
  const { theme } = useTheme();

  if (!playerState.currentSong) {
    return null;
  }

  return (
    <div 
      className="md:hidden fixed bottom-32 left-4 right-4 rounded-lg border border-opacity-20 backdrop-blur-lg shadow-lg z-30"
      style={{ 
        backgroundColor: theme.secondary + 'F0',
        borderColor: theme.text,
      }}
    >
      <button
        onClick={onNowPlayingClick}
        className="flex items-center space-x-3 p-3 w-full hover:bg-opacity-10 transition-colors rounded-lg"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
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
              <span className="text-white text-sm font-bold">
                {playerState.currentSong.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <h4 
            className="font-medium truncate text-sm"
            style={{ color: theme.text }}
          >
            {playerState.currentSong.title}
          </h4>
          <p 
            className="text-xs opacity-70 truncate"
            style={{ color: theme.text }}
          >
            {playerState.currentSong.artist}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playPause();
          }}
          className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
          style={{ backgroundColor: theme.primary }}
        >
          {playerState.isPlaying ? (
            <Pause size={16} fill="white" color="white" />
          ) : (
            <Play size={16} fill="white" color="white" />
          )}
        </button>
      </button>

      {/* Mini Progress Bar */}
      <div 
        className="h-1 rounded-b-lg"
        style={{ backgroundColor: theme.secondary }}
      >
        <div 
          className="h-full rounded-b-lg transition-all duration-200"
          style={{ 
            backgroundColor: theme.primary,
            width: `${playerState.duration ? (playerState.currentTime / playerState.duration) * 100 : 0}%`
          }}
        />
      </div>
    </div>
  );
};

export default MobileNowPlaying;
