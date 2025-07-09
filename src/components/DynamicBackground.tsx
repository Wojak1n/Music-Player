import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';

interface DynamicBackgroundProps {
  intensity?: number;
  particleCount?: number;
  className?: string;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  intensity = 0.5,
  particleCount = 50,
  className = ''
}) => {
  const { playerState, audioRef } = usePlayer();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio analysis
  useEffect(() => {
    if (!audioRef.current || !playerState.currentSong) return;

    const audio = audioRef.current;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      setIsInitialized(true);
      
      return () => {
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      };
    } catch (error) {
      console.error('Error initializing audio context for background:', error);
    }
  }, [playerState.currentSong]);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: theme.primary
      });
    }
    particlesRef.current = particles;
  }, [particleCount, theme.primary]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      
      analyser.getByteFrequencyData(dataArray);

      // Calculate average frequency
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedAverage = average / 255;

      // Clear canvas with gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      
      const baseOpacity = playerState.isPlaying ? normalizedAverage * intensity * 0.3 : 0.05;
      gradient.addColorStop(0, theme.primary + Math.floor(baseOpacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, theme.background + '00');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * (1 + normalizedAverage * intensity);
        particle.y += particle.vy * (1 + normalizedAverage * intensity);

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update size and opacity based on audio
        const frequencyIndex = Math.floor((index / particleCount) * dataArray.length);
        const frequency = dataArray[frequencyIndex] / 255;
        
        particle.size = (1 + frequency * intensity * 2) * (Math.random() * 2 + 1);
        particle.opacity = 0.1 + frequency * intensity * 0.5;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.fill();
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, playerState.isPlaying, theme.primary, theme.background, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: -1,
        opacity: playerState.currentSong ? 1 : 0.3,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
};

export default DynamicBackground;
