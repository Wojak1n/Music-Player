import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ripple?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  style = {},
  ripple = true,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || loading) return;

    // Add ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
      } catch (error) {
        console.error('Button click error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          color: theme.isDark ? '#000' : '#fff',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary + '20',
          color: theme.text,
          border: `1px solid ${theme.secondary}40`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.text,
          border: 'none',
        };
      case 'icon':
        return {
          backgroundColor: 'transparent',
          color: theme.text,
          border: 'none',
          padding: '8px',
          borderRadius: '50%',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = `
    relative overflow-hidden rounded-lg font-medium transition-all duration-200
    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${getSizeStyles()}
    ${className}
  `;

  const focusRingColor = variant === 'primary' ? theme.primary : theme.secondary;

  return (
    <button
      className={baseClasses}
      style={{
        ...getVariantStyles(),
        ...style,
        boxShadow: `0 0 0 0 ${focusRingColor}50`,
      }}
      onClick={handleClick}
      disabled={disabled || isLoading || loading}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${focusRingColor}50`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 0 ${focusRingColor}50`;
      }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping opacity-75"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.5)' : theme.primary + '50',
            pointerEvents: 'none',
          }}
        />
      ))}
      
      {/* Content */}
      <span className="relative flex items-center justify-center space-x-2">
        {(isLoading || loading) && (
          <Loader2 size={16} className="animate-spin" />
        )}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default EnhancedButton;
