import React, { useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

const LyricsDisplay: React.FC = () => {
  const { playerState } = usePlayer();
  const { theme } = useTheme();
  const [lyrics, setLyrics] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (playerState.currentSong) {
      fetchLyrics(playerState.currentSong.title, playerState.currentSong.artist);
    }
  }, [playerState.currentSong]);

  const fetchLyrics = async (title: string, artist: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
      if (response.ok) {
        const data = await response.json();
        setLyrics(data.lyrics || 'Lyrics not found');
      } else {
        setLyrics('Lyrics not found');
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setLyrics('Error loading lyrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (!playerState.currentSong) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg opacity-70" style={{ color: theme.text }}>
          No song selected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
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
              <span className="text-white text-xl font-bold">
                {playerState.currentSong.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>
            {playerState.currentSong.title}
          </h2>
          <p className="opacity-70" style={{ color: theme.text }}>
            {playerState.currentSong.artist}
          </p>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" style={{ borderColor: theme.primary }} />
          </div>
        ) : (
          <div 
            className="whitespace-pre-wrap text-lg leading-relaxed max-h-96 overflow-y-auto p-4 rounded-lg bg-opacity-10"
            style={{ 
              backgroundColor: theme.secondary,
              color: theme.text,
            }}
          >
            {lyrics}
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsDisplay;