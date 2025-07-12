require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const cors = require('cors');

const File = require('./models/File');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resource_type = 'image';
    if (/video/.test(file.mimetype)) resource_type = 'video';
    return {
      folder: 'uploads',
      resource_type,
      public_id: path.parse(file.originalname).name + '-' + Date.now(),
    };
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Reconnection handling
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Reconnecting...');
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// POST /upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      url: req.file.path,
      filename: req.file.originalname,
    });
    await file.save();
    res.json({ success: true, url: file.url, filename: file.filename });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 