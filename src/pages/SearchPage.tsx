import React, { useState } from 'react';
import { Search, Filter, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import SongCard from '../components/SongCard';
import { Song } from '../types';

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { playSong } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock trending searches and recent searches
  const trendingSearches = [
    'The Weeknd', 'Taylor Swift', 'Drake', 'Billie Eilish', 'Ed Sheeran'
  ];

  const recentSearches = [
    'Blinding Lights', 'Shape of You', 'Watermelon Sugar'
  ];

  // Mock search results
  const mockResults: Song[] = [
    {
      id: 'search-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date(),
    },
    {
      id: 'search-2',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 215,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date(),
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        setSearchResults(mockResults.filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-bold mb-6" style={{ color: theme.text }}>
          Search
        </h1>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60"
            style={{ color: theme.text }}
          />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-none outline-none text-lg"
            style={{
              backgroundColor: theme.secondary,
              color: theme.text,
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter size={16} style={{ color: theme.text }} className="opacity-60" />
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeFilter === filter.id ? theme.primary : theme.secondary,
                  color: theme.text,
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
            Search Results
          </h2>
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.primary }}></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={index}
                  showIndex={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="opacity-60" style={{ color: theme.text }}>
                No results found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Browse Content (when no search) */}
      {!searchQuery && (
        <>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Clock size={20} className="mr-2 opacity-60" style={{ color: theme.text }} />
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                  Recent Searches
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 rounded-full text-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: theme.secondary,
                      color: theme.text,
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp size={20} className="mr-2 opacity-60" style={{ color: theme.text }} />
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                Trending Searches
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="p-4 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 text-left"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <span className="text-white font-bold">
                      {search.charAt(0)}
                    </span>
                  </div>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {search}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
