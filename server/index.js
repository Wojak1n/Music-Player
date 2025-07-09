const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ytdl = require('youtube-dl-exec');
const { lyricsSearcher } = require('genius-lyrics');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|ogg|flac|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// YouTube audio extraction endpoint
app.post('/api/youtube-audio', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Extract video info
    const info = await ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      format: 'bestaudio',
      extractFlat: false
    });

    // Extract audio URL
    const audioUrl = info.url;
    
    res.json({
      title: info.title,
      artist: info.uploader || 'Unknown Artist',
      duration: info.duration,
      thumbnail: info.thumbnail,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error('YouTube extraction error:', error);
    res.status(500).json({ error: 'Failed to extract audio from YouTube' });
  }
});

// Lyrics endpoint
app.get('/api/lyrics', async (req, res) => {
  try {
    const { title, artist } = req.query;
    
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }

    const searcher = lyricsSearcher(process.env.GENIUS_API_KEY);
    const lyrics = await searcher.search(`${title} ${artist}`);
    
    res.json({ lyrics: lyrics || 'Lyrics not found' });
  } catch (error) {
    console.error('Lyrics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});