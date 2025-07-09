import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface SpectrumAnalyzerProps {
  width?: number;
  height?: number;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  smoothing?: number;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  width = 300,
  height = 100,
  barCount = 32,
  barWidth = 4,
  barSpacing = 2,
  smoothing = 0.8
}) => {
  const { playerState, audioRef } = usePlayer();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context and analyser
  useEffect(() => {
    if (!audioRef.current || !playerState.currentSong) return;

    const audio = audioRef.current;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = barCount * 4;
      analyser.smoothingTimeConstant = smoothing;
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      setIsInitialized(true);
      
      // Resume audio context on user interaction
      const resumeContext = () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      };
      
      document.addEventListener('click', resumeContext, { once: true });
      
      return () => {
        document.removeEventListener('click', resumeContext);
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      };
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [playerState.currentSong, barCount, smoothing]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const draw = () => {
      if (!playerState.isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate bar dimensions
      const totalBarWidth = barCount * barWidth + (barCount - 1) * barSpacing;
      const startX = (width - totalBarWidth) / 2;

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const barHeight = (dataArray[dataIndex] / 255) * height;
        
        const x = startX + i * (barWidth + barSpacing);
        const y = height - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, theme.primary + '40');
        gradient.addColorStop(0.5, theme.primary + '80');
        gradient.addColorStop(1, theme.primary);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Add glow effect
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, playerState.isPlaying, theme.primary, width, height, barCount, barWidth, barSpacing]);

  if (!playerState.currentSong) {
    return (
      <div 
        className="flex items-center justify-center rounded-lg border-2 border-dashed"
        style={{ 
          width, 
          height,
          borderColor: theme.secondary + '40',
          backgroundColor: theme.secondary + '10',
          color: theme.text + '60'
        }}
      >
        <span className="text-sm">No audio playing</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
        style={{ 
          backgroundColor: theme.secondary + '10',
          border: `1px solid ${theme.secondary}40`
        }}
      />
      {!isInitialized && (
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: theme.secondary + '20' }}
        >
          <div className="flex space-x-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-current rounded-full animate-bounce"
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

export default SpectrumAnalyzer;
