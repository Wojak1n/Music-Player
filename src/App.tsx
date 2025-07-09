import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { ToastProvider } from './contexts/ToastContext';
import Sidebar from './components/Sidebar';
import MobileNavigation from './components/MobileNavigation';
import MobileNowPlaying from './components/MobileNowPlaying';
import PlayerBar from './components/PlayerBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import LikedSongsPage from './pages/LikedSongsPage';
import NowPlayingPage from './pages/NowPlayingPage';
import SettingsPage from './pages/SettingsPage';
import UploadMusic from './components/UploadMusic';
import LyricsDisplay from './components/LyricsDisplay';
import { Song } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const { theme } = useTheme();

  const handleSongUpload = (song: Song) => {
    setSongs(prev => [...prev, song]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'library':
        return <LibraryPage uploadedSongs={songs} />;
      case 'upload':
        return <UploadMusic onSongUpload={handleSongUpload} />;
      case 'liked':
        return <LikedSongsPage />;
      case 'nowplaying':
        return <NowPlayingPage onBackClick={() => setActiveTab('home')} />;
      case 'lyrics':
        return <LyricsDisplay />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Router>
      <div
        className="min-h-screen"
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-6 pb-32 md:pb-24">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <MobileNowPlaying onNowPlayingClick={() => setActiveTab('nowplaying')} />
        <PlayerBar onNowPlayingClick={() => setActiveTab('nowplaying')} />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;