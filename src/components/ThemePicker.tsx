import React, { useState } from 'react';
import { Palette, Upload, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemePicker: React.FC = () => {
  const { theme, setTheme, predefinedThemes, updateThemeColor } = useTheme();
  const [showCustomizer, setShowCustomizer] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateThemeColor('backgroundImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const ColorPicker: React.FC<{ label: string; color: string; onChange: (color: string) => void }> = ({ label, color, onChange }) => (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.secondary + '80' }}>
      <span style={{ color: theme.text }}>{label}</span>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded-full border-2 border-white border-opacity-20"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full border-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: theme.text }}>
          Theme Customization
        </h2>
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ color: theme.text }}
        >
          <Palette size={20} />
        </button>
      </div>

      {/* Predefined Themes */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
          Predefined Themes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {predefinedThemes.map((presetTheme) => (
            <button
              key={presetTheme.id}
              onClick={() => setTheme(presetTheme)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                theme.id === presetTheme.id ? 'border-opacity-100' : 'border-opacity-20'
              }`}
              style={{
                backgroundColor: presetTheme.background,
                borderColor: presetTheme.primary,
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: presetTheme.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: presetTheme.accent }}
                />
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: presetTheme.text }}
              >
                {presetTheme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Editor */}
      {showCustomizer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
              Custom Colors
            </h3>
            <button
              onClick={() => setShowCustomizer(false)}
              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ color: theme.text }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <ColorPicker
              label="Primary Color"
              color={theme.primary}
              onChange={(color) => updateThemeColor('primary', color)}
            />
            <ColorPicker
              label="Secondary Color"
              color={theme.secondary}
              onChange={(color) => updateThemeColor('secondary', color)}
            />
            <ColorPicker
              label="Accent Color"
              color={theme.accent}
              onChange={(color) => updateThemeColor('accent', color)}
            />
            <ColorPicker
              label="Background Color"
              color={theme.background}
              onChange={(color) => updateThemeColor('background', color)}
            />
            <ColorPicker
              label="Text Color"
              color={theme.text}
              onChange={(color) => updateThemeColor('text', color)}
            />
          </div>

          {/* Background Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: theme.text }}>
              Background Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 p-3 rounded-lg border-2 border-dashed border-opacity-30 cursor-pointer hover:border-opacity-50 transition-colors">
                <Upload size={20} style={{ color: theme.text }} />
                <span style={{ color: theme.text }}>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {theme.backgroundImage && (
                <button
                  onClick={() => updateThemeColor('backgroundImage', '')}
                  className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                  style={{ color: theme.text }}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;