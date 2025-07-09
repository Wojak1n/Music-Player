import React, { useState } from 'react';
import { Heart, Play, Shuffle, Download, Search, Clock, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import SongCard from '../components/SongCard';
import { Song } from '../types';

const LikedSongsPage: React.FC = () => {
  const { theme } = useTheme();
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock liked songs data
  const likedSongs: Song[] = [
    {
      id: 'liked-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-15'),
      likedAt: new Date('2024-01-16'),
    },
    {
      id: 'liked-2',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-05'),
      likedAt: new Date('2024-01-12'),
    },
    {
      id: 'liked-3',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-01'),
      likedAt: new Date('2024-01-08'),
    },
  ];

  const sortOptions = [
    { id: 'recent', label: 'Recently Liked' },
    { id: 'title', label: 'Title' },
    { id: 'artist', label: 'Artist' },
    { id: 'album', label: 'Album' },
  ];

  const filteredAndSortedSongs = likedSongs
    .filter(song => {
      if (searchQuery) {
        return song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
               song.album.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'album':
          return a.album.localeCompare(b.album);
        case 'recent':
        default:
          return (b.likedAt?.getTime() || 0) - (a.likedAt?.getTime() || 0);
      }
    });

  const totalDuration = likedSongs.reduce((total, song) => total + song.duration, 0);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handlePlayAll = () => {
    if (filteredAndSortedSongs.length > 0) {
      playSong(filteredAndSortedSongs[0], filteredAndSortedSongs);
    }
  };

  const handleShuffle = () => {
    if (filteredAndSortedSongs.length > 0) {
      const shuffled = [...filteredAndSortedSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
        {/* Liked Songs Icon */}
        <div 
          className="w-48 h-48 rounded-lg flex items-center justify-center shadow-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}80)` 
          }}
        >
          <Heart size={80} fill="white" color="white" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-medium opacity-70 mb-2" style={{ color: theme.text }}>
            Playlist
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: theme.text }}>
            Liked Songs
          </h1>
          <div className="flex items-center text-sm opacity-70" style={{ color: theme.text }}>
            <span>{likedSongs.length} songs</span>
            <span className="mx-2">•</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={filteredAndSortedSongs.length === 0}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: theme.primary }}
        >
          <Play size={20} fill="white" color="white" />
        </button>

        <button
          onClick={handleShuffle}
          disabled={filteredAndSortedSongs.length === 0}
          className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            color: theme.text,
            backgroundColor: 'transparent'
          }}
        >
          <Shuffle size={24} />
        </button>

        <button
          className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-20"
          style={{ 
            color: theme.text,
            backgroundColor: 'transparent'
          }}
        >
          <Download size={24} />
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
            style={{ color: theme.text }}
          />
          <input
            type="text"
            placeholder="Search in liked songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none outline-none"
            style={{
              backgroundColor: theme.secondary,
              color: theme.text,
            }}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border-none outline-none"
          style={{
            backgroundColor: theme.secondary,
            color: theme.text,
          }}
        >
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Songs List */}
      {filteredAndSortedSongs.length > 0 ? (
        <div className="space-y-2">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm opacity-60 border-b border-opacity-20" style={{ color: theme.text, borderColor: theme.text }}>
            <div className="col-span-1">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-1 flex justify-center">
              <Calendar size={16} />
            </div>
            <div className="col-span-1 flex justify-center">
              <Clock size={16} />
            </div>
          </div>

          {/* Songs */}
          {filteredAndSortedSongs.map((song, index) => (
            <div
              key={song.id}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-all duration-200 cursor-pointer group"
              style={{ backgroundColor: currentSong?.id === song.id ? theme.primary + '20' : 'transparent' }}
              onClick={() => playSong(song, filteredAndSortedSongs)}
            >
              <div className="col-span-1 flex items-center">
                <span className="text-sm opacity-60 group-hover:opacity-100" style={{ color: theme.text }}>
                  {index + 1}
                </span>
              </div>
              
              <div className="col-span-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  {song.thumbnail ? (
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <span className="text-white text-xs font-bold">
                        {song.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: theme.text }}>
                    {song.title}
                  </p>
                  <p className="text-sm opacity-70 truncate" style={{ color: theme.text }}>
                    {song.artist}
                  </p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <p className="text-sm opacity-70 truncate" style={{ color: theme.text }}>
                  {song.album}
                </p>
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <p className="text-sm opacity-60" style={{ color: theme.text }}>
                  {song.likedAt ? new Date(song.likedAt).toLocaleDateString() : '-'}
                </p>
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <p className="text-sm opacity-60" style={{ color: theme.text }}>
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto mb-4 opacity-30" style={{ color: theme.text }} />
          <h3 className="text-xl font-medium mb-2" style={{ color: theme.text }}>
            {searchQuery ? 'No results found' : 'No liked songs yet'}
          </h3>
          <p className="opacity-60 mb-6" style={{ color: theme.text }}>
            {searchQuery 
              ? `No liked songs match "${searchQuery}"`
              : 'Songs you like will appear here. Start by liking some songs!'
            }
          </p>
          {!searchQuery && (
            <button
              className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
              }}
            >
              Discover Music
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedSongsPage;
