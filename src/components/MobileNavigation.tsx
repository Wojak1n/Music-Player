import React from 'react';
import { Home, Search, Library, Upload, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 border-t border-opacity-20 backdrop-blur-lg z-50"
      style={{ 
        backgroundColor: theme.secondary + 'E6',
        borderColor: theme.text,
      }}
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
              style={{
                color: isActive ? theme.primary : theme.text + '80',
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