import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface AudioVisualizerProps {
  height?: number;
  showControls?: boolean;
  responsive?: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  height = 80, 
  showControls = false,
  responsive = true 
}) => {
  const { playerState, setCurrentTime } = usePlayer();
  const { theme } = useTheme();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: theme.primary + '60',
      progressColor: theme.primary,
      cursorColor: theme.primary,
      barWidth: 2,
      barRadius: 1,
      responsive: responsive,
      height: height,
      normalize: true,
      backend: 'WebAudio',
      mediaControls: showControls,
    });

    const wavesurfer = wavesurferRef.current;

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsReady(true);
    });

    wavesurfer.on('seek', (progress) => {
      if (playerState.currentSong) {
        const newTime = progress * playerState.duration;
        setCurrentTime(newTime);
      }
    });

    wavesurfer.on('error', (error) => {
      console.error('WaveSurfer error:', error);
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [theme.primary, height, responsive, showControls]);

  // Load new audio when song changes
  useEffect(() => {
    if (wavesurferRef.current && playerState.currentSong) {
      setIsReady(false);
      wavesurferRef.current.load(playerState.currentSong.url);
    }
  }, [playerState.currentSong]);

  // Sync with player state
  useEffect(() => {
    if (wavesurferRef.current && isReady && playerState.duration > 0) {
      const progress = playerState.currentTime / playerState.duration;
      wavesurferRef.current.seekTo(progress);
    }
  }, [playerState.currentTime, playerState.duration, isReady]);

  // Update colors when theme changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setWaveColor(theme.primary + '60');
      wavesurferRef.current.setProgressColor(theme.primary);
      wavesurferRef.current.setCursorColor(theme.primary);
    }
  }, [theme.primary]);

  if (!playerState.currentSong) {
    return (
      <div 
        className="flex items-center justify-center rounded-lg"
        style={{ 
          height: height,
          backgroundColor: theme.secondary + '20',
          color: theme.text + '60'
        }}
      >
        <span className="text-sm">No audio loaded</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={waveformRef} 
        className="w-full rounded-lg overflow-hidden"
        style={{ 
          backgroundColor: theme.secondary + '10',
        }}
      />
      {!isReady && (
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: theme.secondary + '20' }}
        >
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-current rounded-full animate-pulse"
                style={{ 
                  height: Math.random() * 20 + 10,
                  color: theme.primary,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
