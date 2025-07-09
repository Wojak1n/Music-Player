import React from 'react';
import { Home, Search, Library, Upload, Settings, Heart, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  const secondaryItems = [
    { id: 'upload', label: 'Upload Music', icon: Upload },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
  ];

  return (
    <div 
      className="hidden md:flex flex-col w-64 min-h-screen p-6 border-r border-opacity-20"
      style={{ 
        backgroundColor: theme.secondary,
        borderColor: theme.text,
      }}
    >
      <div className="flex items-center mb-8">
        <div 
          className="w-8 h-8 rounded-full mr-3"
          style={{ backgroundColor: theme.primary }}
        />
        <h1 
          className="text-xl font-bold"
          style={{ color: theme.text }}
        >
          MusicPlayer
        </h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-opacity-20' : 'hover:bg-opacity-10'
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.primary : 'transparent',
                    color: isActive ? theme.text : theme.text + '80',
                  }}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-sm font-semibold opacity-60"
              style={{ color: theme.text }}
            >
              Recently Created
            </h2>
            <button 
              className="p-1 rounded hover:bg-opacity-10 transition-colors"
              style={{ color: theme.text }}
            >
              <Plus size={16} />
            </button>
          </div>
          <ul className="space-y-2">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-opacity-20' : 'hover:bg-opacity-10'
                    }`}
                    style={{
                      backgroundColor: isActive ? theme.primary : 'transparent',
                      color: isActive ? theme.text : theme.text + '80',
                    }}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <button
        onClick={() => onTabChange('settings')}
        className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 mt-auto ${
          activeTab === 'settings' ? 'bg-opacity-20' : 'hover:bg-opacity-10'
        }`}
        style={{
          backgroundColor: activeTab === 'settings' ? theme.primary : 'transparent',
          color: activeTab === 'settings' ? theme.text : theme.text + '80',
        }}
      >
        <Settings size={20} className="mr-3" />
        <span className="font-medium">Settings</span>
      </button>
    </div>
  );
};

export default Sidebar;