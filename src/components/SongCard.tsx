import React, { useState } from 'react';
import { Play, MoreHorizontal, Heart, Plus, Loader2 } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

interface SongCardProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  onAddToPlaylist?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, index, showIndex, onAddToPlaylist }) => {
  const { playSong, addToQueue, playerState } = usePlayer();
  const { theme } = useTheme();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isCurrentSong = playerState.currentSong?.id === song.id;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      playSong(song);
      // Simulate loading time for better UX
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    toast.showSuccess('Added to queue', `${song.title} by ${song.artist}`);
  };

  return (
    <div 
      className={`group flex items-center p-3 rounded-lg hover:bg-opacity-10 transition-all duration-200 ${
        isCurrentSong ? 'bg-opacity-20' : ''
      }`}
      style={{
        backgroundColor: isCurrentSong ? theme.primary : 'transparent',
      }}
    >
      {/* Index/Play Button */}
      <div className="w-8 flex items-center justify-center mr-4">
        {showIndex && (
          <span 
            className={`text-sm group-hover:hidden ${isCurrentSong ? 'text-white' : 'text-gray-400'}`}
            style={{ color: isCurrentSong ? theme.text : theme.text + '60' }}
          >
            {index! + 1}
          </span>
        )}
        <button
          onClick={handlePlay}
          disabled={isLoading}
          className={`${showIndex ? 'hidden' : 'flex'} group-hover:flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: theme.primary,
            color: theme.isDark ? '#000' : '#fff'
          }}
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        </button>
      </div>

      {/* Song Info */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4 flex-shrink-0 overflow-hidden relative">
          {song.thumbnail ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg" />
              )}
              <img
                src={song.thumbnail}
                alt={song.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <span className="text-white text-sm font-bold">
                {song.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 
            className={`font-medium truncate ${isCurrentSong ? 'text-white' : ''}`}
            style={{ color: isCurrentSong ? theme.text : theme.text }}
          >
            {song.title}
          </h4>
          <p 
            className={`text-sm opacity-70 truncate ${isCurrentSong ? 'text-white' : ''}`}
            style={{ color: isCurrentSong ? theme.text : theme.text }}
          >
            {song.artist}
          </p>
        </div>
      </div>

      {/* Album */}
      <div className="hidden md:block w-48 mx-4">
        <p 
          className="text-sm opacity-70 truncate"
          style={{ color: theme.text }}
        >
          {song.album || 'Unknown Album'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
          style={{ color: theme.text }}
        >
          <Heart size={16} />
        </button>
        <button 
          onClick={handleAddToQueue}
          className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
          style={{ color: theme.text }}
        >
          <Plus size={16} />
        </button>
        <button 
          className="p-2 hover:bg-opacity-10 rounded-full transition-colors"
          style={{ color: theme.text }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Duration */}
      <div className="ml-4 w-12 text-right">
        <span 
          className="text-sm opacity-70"
          style={{ color: theme.text }}
        >
          {formatDuration(song.duration)}
        </span>
      </div>
    </div>
  );
};

export default SongCard;