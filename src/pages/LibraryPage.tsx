import React, { useState } from 'react';
import { Music, Folder, Clock, Grid3X3, List, Search, Filter, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import SongCard from '../components/SongCard';
import { Song } from '../types';

interface LibraryPageProps {
  uploadedSongs?: Song[];
}

const LibraryPage: React.FC<LibraryPageProps> = ({ uploadedSongs = [] }) => {
  const { theme } = useTheme();
  const { playSong } = usePlayer();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock library data combined with uploaded songs
  const mockLibraryItems: Song[] = [
    {
      id: 'lib-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: 'lib-2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 233,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-10'),
    },
    {
      id: 'lib-3',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-05'),
    },
    {
      id: 'lib-4',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date('2024-01-01'),
    },
  ];

  // Combine mock data with uploaded songs
  const libraryItems = [...mockLibraryItems, ...uploadedSongs];

  const sortOptions = [
    { id: 'recent', label: 'Recently Added' },
    { id: 'title', label: 'Title' },
    { id: 'artist', label: 'Artist' },
    { id: 'album', label: 'Album' },
    { id: 'duration', label: 'Duration' },
  ];

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'playlists', label: 'Playlists' },
  ];

  const filteredAndSortedItems = libraryItems
    .filter(item => {
      if (searchQuery) {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item.album || '').toLowerCase().includes(searchQuery.toLowerCase());
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
          return (a.album || '').localeCompare(b.album || '');
        case 'duration':
          return a.duration - b.duration;
        case 'recent':
        default:
          return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
            Your Library
          </h1>
          <p className="opacity-70" style={{ color: theme.text }}>
            {libraryItems.length} songs in your collection
          </p>
        </div>
        
        <button
          className="flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: theme.primary,
            color: theme.text,
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Music
        </button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
            style={{ color: theme.text }}
          />
          <input
            type="text"
            placeholder="Search in your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none outline-none"
            style={{
              backgroundColor: theme.secondary,
              color: theme.text,
            }}
          />
        </div>

        {/* Sort */}
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

        {/* Filter */}
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-4 py-2 rounded-lg border-none outline-none"
          style={{
            backgroundColor: theme.secondary,
            color: theme.text,
          }}
        >
          {filterOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: theme.secondary }}>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-all duration-200 ${viewMode === 'list' ? 'opacity-100' : 'opacity-60'}`}
            style={{
              backgroundColor: viewMode === 'list' ? theme.primary : 'transparent',
              color: theme.text,
            }}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-all duration-200 ${viewMode === 'grid' ? 'opacity-100' : 'opacity-60'}`}
            style={{
              backgroundColor: viewMode === 'grid' ? theme.primary : 'transparent',
              color: theme.text,
            }}
          >
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      {/* Library Content */}
      {filteredAndSortedItems.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-2">
            {filteredAndSortedItems.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                index={index}
                showIndex={true}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAndSortedItems.map((song) => (
              <div
                key={song.id}
                className="p-4 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 cursor-pointer group"
                style={{ backgroundColor: theme.secondary }}
                onClick={() => playSong(song, filteredAndSortedItems)}
              >
                <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
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
                      <Music size={24} style={{ color: theme.text }} />
                    </div>
                  )}
                </div>
                <h3 className="font-medium truncate text-sm mb-1" style={{ color: theme.text }}>
                  {song.title}
                </h3>
                <p className="text-xs opacity-70 truncate" style={{ color: theme.text }}>
                  {song.artist}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto mb-4 opacity-30" style={{ color: theme.text }} />
          <h3 className="text-xl font-medium mb-2" style={{ color: theme.text }}>
            {searchQuery ? 'No results found' : 'Your library is empty'}
          </h3>
          <p className="opacity-60 mb-6" style={{ color: theme.text }}>
            {searchQuery 
              ? `No songs match "${searchQuery}"`
              : 'Start building your music collection by uploading songs'
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
              Upload Your First Song
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
