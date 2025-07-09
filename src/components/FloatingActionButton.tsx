import React, { useState } from 'react';
import { X, Settings, Minimize2, Maximize2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface FloatingActionButtonProps {
  onSettingsClick: () => void;
  onMinimizePlayer?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onSettingsClick, onMinimizePlayer }) => {
  const { playerState } = usePlayer();
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playerState.currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:hidden">
      {/* Main floating button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full shadow-lg backdrop-blur-lg border border-opacity-20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: theme.primary + 'E6',
            borderColor: theme.text + '20',
            color: theme.isDark ? '#000' : '#fff',
          }}
        >
          {isExpanded ? <X size={24} /> : <Settings size={24} />}
        </button>

        {/* Expanded menu */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 flex flex-col space-y-3">
            {/* Settings button */}
            <button
              onClick={() => {
                onSettingsClick();
                setIsExpanded(false);
              }}
              className="w-12 h-12 rounded-full shadow-lg backdrop-blur-lg border border-opacity-20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: theme.secondary + 'E6',
                borderColor: theme.text + '20',
                color: theme.text,
              }}
            >
              <Settings size={20} />
            </button>

            {/* Minimize player button */}
            {onMinimizePlayer && (
              <button
                onClick={() => {
                  onMinimizePlayer();
                  setIsExpanded(false);
                }}
                className="w-12 h-12 rounded-full shadow-lg backdrop-blur-lg border border-opacity-20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: theme.secondary + 'E6',
                  borderColor: theme.text + '20',
                  color: theme.text,
                }}
              >
                <Minimize2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Backdrop to close expanded menu */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
