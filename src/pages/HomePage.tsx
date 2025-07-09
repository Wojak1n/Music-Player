import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import SongCard from '../components/SongCard';
import { SongCardSkeleton, RecentlyPlayedSkeleton, GridCardSkeleton } from '../components/SkeletonLoader';
import { Song } from '../types';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const { playSong } = usePlayer();
  const [isLoading, setIsLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateIn(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for demonstration
  const recentlyPlayed: Song[] = [
    {
      id: '1',
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
      id: '2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 233,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date(),
    },
  ];

  const quickPicks: Song[] = [
    {
      id: '3',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date(),
    },
    {
      id: '4',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
      source: 'local',
      uploadedAt: new Date(),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Welcome Section Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" style={{ backgroundColor: theme.secondary + '40' }} />
          <div className="h-6 w-64 bg-gray-300 rounded animate-pulse" style={{ backgroundColor: theme.secondary + '40' }} />
        </div>

        {/* Recently Played Skeleton */}
        <div>
          <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4" style={{ backgroundColor: theme.secondary + '40' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <RecentlyPlayedSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Quick Picks Skeleton */}
        <div>
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4" style={{ backgroundColor: theme.secondary + '40' }} />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Trending Skeleton */}
        <div>
          <div className="h-6 w-36 bg-gray-300 rounded animate-pulse mb-4" style={{ backgroundColor: theme.secondary + '40' }} />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <GridCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Welcome Section */}
      <div className="transform transition-all duration-500 delay-100">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          Good evening
        </h1>
        <p className="opacity-70 text-lg" style={{ color: theme.text }}>
          Welcome back to your music
        </p>
      </div>

      {/* Recently Played */}
      <div className="transform transition-all duration-500 delay-200">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          Recently Played
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyPlayed.map((song, index) => (
            <div
              key={song.id}
              className="p-4 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 cursor-pointer group hover:scale-105 transform"
              style={{
                backgroundColor: theme.secondary,
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => playSong(song, recentlyPlayed)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
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
                      <span className="text-white text-lg font-bold">
                        {song.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate" style={{ color: theme.text }}>
                    {song.title}
                  </h3>
                  <p className="text-sm opacity-70 truncate" style={{ color: theme.text }}>
                    {song.artist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Picks */}
      <div className="transform transition-all duration-500 delay-300">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          Made for You
        </h2>
        <div className="space-y-2">
          {quickPicks.map((song, index) => (
            <div
              key={song.id}
              className="transform transition-all duration-300 hover:translate-x-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SongCard
                song={song}
                index={index}
                showIndex={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="transform transition-all duration-500 delay-500">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...recentlyPlayed, ...quickPicks].map((song, index) => (
            <div
              key={song.id}
              className="p-4 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 cursor-pointer group hover:scale-105 transform"
              style={{
                backgroundColor: theme.secondary,
                animationDelay: `${index * 50}ms`
              }}
              onClick={() => playSong(song)}
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
                    <span className="text-white text-lg font-bold">
                      {song.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-medium truncate text-sm" style={{ color: theme.text }}>
                {song.title}
              </h3>
              <p className="text-xs opacity-70 truncate" style={{ color: theme.text }}>
                {song.artist}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;