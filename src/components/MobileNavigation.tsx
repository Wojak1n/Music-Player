import React from 'react';
import { Home, Search, Library, Upload, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  console.log('MobileNavigation rendered, activeTab:', activeTab);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t-2 border-opacity-50 backdrop-blur-lg z-[9999]"
      style={{
        backgroundColor: theme.isDark ? '#1a1a1a' : '#ffffff',
        borderColor: theme.primary,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-around py-3 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Mobile nav button clicked:', tab.id);
                if (tab.id === 'settings') {
                  alert('Settings button clicked!');
                }
                onTabChange(tab.id);
              }}
              className="flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-0 flex-1"
              style={{
                color: isActive ? theme.primary : theme.text + '80',
                backgroundColor: tab.id === 'settings' ? '#ff0000' : (isActive ? theme.primary + '20' : 'transparent'),
                border: tab.id === 'settings' ? '2px solid #ff0000' : 'none',
              }}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;