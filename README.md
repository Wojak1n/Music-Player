# MusicPlayer - Modern Music Player with YouTube Integration

A sleek, modern music player built with React, TypeScript, and Tailwind CSS. Features YouTube audio extraction, custom themes, lyrics display, and mobile support.

## Features

- 🎵 **Multi-source Audio Support**: Play local files (MP3, WAV, OGG, FLAC) and YouTube videos
- 🎨 **Dynamic Themes**: Spotify-inspired themes with custom color schemes and backgrounds
- 📱 **Mobile Ready**: Responsive design with PWA support and Capacitor.js for native mobile apps
- 🎤 **Lyrics Integration**: Automatic lyrics fetching with Genius API
- 🔊 **Audio Visualizer**: Real-time waveform visualization with WaveSurfer.js
- 🎛️ **Full Player Controls**: Play, pause, skip, shuffle, repeat, volume control
- 📚 **Library Management**: Upload, organize, and manage your music collection
- 🌓 **Dark/Light Mode**: Toggle between themes with smooth transitions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Context API for state management
- Lucide React for icons

### Backend
- Node.js + Express
- MongoDB for data storage
- Multer for file uploads
- YouTube-dl-exec for video processing
- Genius API for lyrics

### Mobile
- Capacitor.js for native mobile apps
- PWA support with service workers
- Responsive design for all devices

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd music-player-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Install server dependencies**
```bash
cd server
npm install
```

4. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- `GENIUS_API_KEY`: Get from [Genius API](https://genius.com/api-clients)
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 3001)

5. **Install YouTube-dl**
```bash
# macOS
brew install youtube-dl

# Ubuntu/Debian
sudo apt install youtube-dl

# Windows
# Download from https://youtube-dl.org/
```

## Development

### Start Development Server
```bash
# Start both frontend and backend
npm run dev:full

# Or start individually
npm run dev          # Frontend only
npm run server       # Backend only
```

### Build for Production
```bash
npm run build
```

### Mobile Development

#### Setup Capacitor
```bash
npm install -g @capacitor/cli
npx cap init
```

#### Build Mobile App
```bash
npm run build:mobile
```

#### Run on Android
```bash
npm run mobile:android
```

#### Run on iOS
```bash
npm run mobile:ios
```

## Usage

### Local Music Upload
1. Navigate to the "Upload" tab
2. Drag and drop audio files or click "Browse Files"
3. Supported formats: MP3, WAV, OGG, FLAC, M4A

### YouTube Integration
1. Go to the "Upload" tab
2. Paste a YouTube URL in the input field
3. Click "Add Song" to extract and add the audio

### Theme Customization
1. Go to Settings → Theme Customization
2. Choose from predefined themes or create custom ones
3. Upload background images for personalized themes
4. Adjust colors using the color picker

### Lyrics Display
- Lyrics are automatically fetched when playing songs
- Manual lyrics can be added for songs without available lyrics
- Synced lyrics display (future feature)

## API Endpoints

### Audio Processing
- `POST /api/youtube-audio` - Extract audio from YouTube URL
- `POST /api/upload` - Upload local audio files

### Lyrics
- `GET /api/lyrics?title=<title>&artist=<artist>` - Fetch lyrics

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
music-player-app/
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── server/
│   ├── index.js           # Express server
│   └── uploads/           # Upload directory
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── capacitor.config.ts    # Capacitor configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **YouTube-dl not found**
   - Install youtube-dl globally
   - Ensure it's in your PATH

2. **CORS errors**
   - Check CORS_ORIGIN in .env
   - Ensure backend is running on correct port

3. **File upload fails**
   - Check file size limits
   - Ensure uploads directory exists

4. **Mobile build fails**
   - Install Capacitor CLI globally
   - Ensure Android Studio/Xcode is properly configured

### Performance Tips

1. **Large Libraries**
   - Use pagination for large song lists
   - Implement lazy loading for thumbnails

2. **Mobile Performance**
   - Enable hardware acceleration
   - Optimize images and audio files

3. **Memory Usage**
   - Clear unused audio instances
   - Implement proper cleanup in useEffect

## Future Enhancements

- [ ] Synced lyrics display
- [ ] Cloud storage integration
- [ ] Social features (sharing, collaborative playlists)
- [ ] Advanced audio effects
- [ ] Offline mode improvements
- [ ] Voice commands
- [ ] Last.fm integration
- [ ] Spotify Connect-like features

## Support

For issues and questions, please create an issue on the repository or contact the maintainers.