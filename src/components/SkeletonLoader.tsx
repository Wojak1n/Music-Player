import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`${width} ${height} ${rounded ? 'rounded-full' : 'rounded'} animate-pulse ${className}`}
      style={{ backgroundColor: theme.secondary + '40' }}
    />
  );
};

// Song Card Skeleton
export const SongCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="group flex items-center p-3 rounded-lg">
      {/* Index/Play Button */}
      <div className="w-8 flex items-center justify-center mr-4">
        <SkeletonLoader width="w-6" height="h-6" rounded />
      </div>

      {/* Song Info */}
      <div className="flex items-center flex-1 min-w-0">
        <SkeletonLoader width="w-12" height="h-12" className="mr-4 flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLoader width="w-3/4" height="h-4" />
          <SkeletonLoader width="w-1/2" height="h-3" />
        </div>
      </div>

      {/* Album */}
      <div className="hidden md:block w-48 mx-4">
        <SkeletonLoader width="w-32" height="h-3" />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <SkeletonLoader width="w-4" height="h-4" rounded />
        <SkeletonLoader width="w-4" height="h-4" rounded />
        <SkeletonLoader width="w-4" height="h-4" rounded />
      </div>

      {/* Duration */}
      <div className="ml-4 w-12 text-right">
        <SkeletonLoader width="w-8" height="h-3" />
      </div>
    </div>
  );
};

// Grid Card Skeleton
export const GridCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-lg">
      <SkeletonLoader width="w-full" height="h-32" className="mb-3" />
      <SkeletonLoader width="w-3/4" height="h-4" className="mb-2" />
      <SkeletonLoader width="w-1/2" height="h-3" />
    </div>
  );
};

// Recently Played Skeleton
export const RecentlyPlayedSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-lg">
      <div className="flex items-center space-x-4">
        <SkeletonLoader width="w-16" height="h-16" className="flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLoader width="w-3/4" height="h-4" />
          <SkeletonLoader width="w-1/2" height="h-3" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
