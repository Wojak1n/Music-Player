import React, { useState } from 'react';
import { Upload, Link, Plus, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '../contexts/ThemeContext';
import { Song } from '../types';

interface UploadMusicProps {
  onSongUpload: (song: Song) => void;
}

const UploadMusic: React.FC<UploadMusicProps> = ({ onSongUpload }) => {
  const { theme } = useTheme();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const song: Song = {
          id: Date.now().toString(),
          title: file.name.split('.')[0],
          artist: 'Unknown Artist',
          duration: 0, // Will be set when audio loads
          url,
          source: 'local',
          uploadedAt: new Date(),
        };
        onSongUpload(song);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.m4a'],
    },
    multiple: true,
  });

  const handleYoutubeUpload = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsLoading(true);
    try {
      // This would typically call your backend API
      const response = await fetch('/api/youtube-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (response.ok) {
        const songData = await response.json();
        const song: Song = {
          id: Date.now().toString(),
          title: songData.title,
          artist: songData.artist || 'Unknown Artist',
          duration: songData.duration || 0,
          url: songData.audioUrl,
          thumbnail: songData.thumbnail,
          source: 'youtube',
          uploadedAt: new Date(),
        };
        onSongUpload(song);
        setYoutubeUrl('');
      }
    } catch (error) {
      console.error('Error uploading YouTube audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
          Upload Music
        </h2>
        <p className="opacity-70" style={{ color: theme.text }}>
          Upload your local music files or add songs from YouTube
        </p>
      </div>

      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragActive ? 'border-opacity-100 bg-opacity-5' : 'border-opacity-30 hover:border-opacity-50'
        }`}
        style={{ borderColor: theme.primary, backgroundColor: isDragActive ? theme.primary : 'transparent' }}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="mx-auto mb-4" style={{ color: theme.primary }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          {isDragActive ? 'Drop files here' : 'Drag & drop music files'}
        </h3>
        <p className="opacity-70 mb-4" style={{ color: theme.text }}>
          Supports MP3, WAV, OGG, FLAC, and M4A files
        </p>
        <button
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: theme.primary, color: theme.isDark ? '#000' : '#fff' }}
        >
          Browse Files
        </button>
      </div>

      {/* YouTube URL Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
          Add from YouTube
        </h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="w-full px-4 py-3 rounded-lg border border-opacity-30 bg-opacity-10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
              style={{
                backgroundColor: theme.secondary,
                borderColor: theme.text,
                color: theme.text,
              }}
            />
          </div>
          <button
            onClick={handleYoutubeUpload}
            disabled={isLoading || !youtubeUrl.trim()}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            style={{ backgroundColor: theme.primary, color: theme.isDark ? '#000' : '#fff' }}
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Plus size={20} />
            )}
            <span>{isLoading ? 'Adding...' : 'Add Song'}</span>
          </button>
        </div>
        <p className="text-sm opacity-70" style={{ color: theme.text }}>
          Paste a YouTube video URL to extract and add the audio to your library
        </p>
      </div>

      {/* Upload Tips */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
          Upload Tips
        </h3>
        <div className="space-y-2">
          {[
            'For best quality, use lossless formats like FLAC or WAV',
            'Make sure your files have proper metadata (title, artist, album)',
            'YouTube videos will be converted to audio automatically',
            'Large files may take longer to upload and process',
          ].map((tip, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div 
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: theme.primary }}
              />
              <p className="text-sm opacity-70" style={{ color: theme.text }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadMusic;