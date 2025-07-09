import React from 'react';
import { Moon, Sun, Volume2, Wifi, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemePicker from '../components/ThemePicker';

const SettingsPage: React.FC = () => {
  const { theme, toggleDarkMode } = useTheme();

  const SettingItem: React.FC<{ 
    icon: React.ComponentType<any>; 
    title: string; 
    description: string; 
    children: React.ReactNode; 
  }> = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-opacity-10" style={{ backgroundColor: theme.secondary }}>
      <div className="flex items-center space-x-4">
        <Icon size={24} style={{ color: theme.primary }} />
        <div>
          <h3 className="font-medium" style={{ color: theme.text }}>
            {title}
          </h3>
          <p className="text-sm opacity-70" style={{ color: theme.text }}>
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          Settings
        </h1>
        <p className="opacity-70" style={{ color: theme.text }}>
          Customize your music experience
        </p>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
          Appearance
        </h2>
        <SettingItem
          icon={theme.isDark ? Moon : Sun}
          title="Dark Mode"
          description="Toggle between light and dark themes"
        >
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
              theme.isDark ? 'bg-opacity-100' : 'bg-opacity-30'
            }`}
            style={{ backgroundColor: theme.primary }}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                theme.isDark ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </SettingItem>
      </div>

      {/* Theme Customization */}
      <ThemePicker />

      {/* Audio Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
          Audio
        </h2>
        <SettingItem
          icon={Volume2}
          title="Audio Quality"
          description="Choose your preferred audio quality"
        >
          <select
            className="px-3 py-2 rounded-lg border border-opacity-30 bg-opacity-10 backdrop-blur-sm"
            style={{
              backgroundColor: theme.secondary,
              borderColor: theme.text,
              color: theme.text,
            }}
          >
            <option value="high">High (320kbps)</option>
            <option value="medium">Medium (128kbps)</option>
            <option value="low">Low (96kbps)</option>
          </select>
        </SettingItem>
      </div>

      {/* Network */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
          Network
        </h2>
        <SettingItem
          icon={Wifi}
          title="Stream Quality"
          description="Quality for streaming from external sources"
        >
          <select
            className="px-3 py-2 rounded-lg border border-opacity-30 bg-opacity-10 backdrop-blur-sm"
            style={{
              backgroundColor: theme.secondary,
              borderColor: theme.text,
              color: theme.text,
            }}
          >
            <option value="auto">Auto</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </SettingItem>
        <SettingItem
          icon={Download}
          title="Download Quality"
          description="Quality for downloaded music"
        >
          <select
            className="px-3 py-2 rounded-lg border border-opacity-30 bg-opacity-10 backdrop-blur-sm"
            style={{
              backgroundColor: theme.secondary,
              borderColor: theme.text,
              color: theme.text,
            }}
          >
            <option value="lossless">Lossless</option>
            <option value="high">High (320kbps)</option>
            <option value="medium">Medium (128kbps)</option>
          </select>
        </SettingItem>
      </div>

      {/* About */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
          About
        </h2>
        <div className="p-4 rounded-lg bg-opacity-10" style={{ backgroundColor: theme.secondary }}>
          <div className="space-y-2">
            <p className="font-medium" style={{ color: theme.text }}>
              MusicPlayer v1.0.0
            </p>
            <p className="text-sm opacity-70" style={{ color: theme.text }}>
              A modern music player with YouTube integration and custom themes
            </p>
            <p className="text-sm opacity-70" style={{ color: theme.text }}>
              Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;