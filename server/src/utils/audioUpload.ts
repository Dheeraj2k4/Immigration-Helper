/**
 * Multer Configuration for Audio File Uploads
 * Handles audio file validation and storage
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/audio');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only audio files
const fileFilter = (_req: any, file: any, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'audio/x-flac',
  ];

  const allowedExtensions = ['.wav', '.mp3', '.ogg', '.webm', '.flac'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files (WAV, MP3, OGG, WEBM, FLAC) are allowed.'));
  }
};

// Configure multer upload
export const audioUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

/**
 * Clean up uploaded file
 * @param filePath Path to file to delete
 */
export const deleteUploadedFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

/**
 * Clean up old uploaded files (older than 1 hour)
 */
export const cleanupOldFiles = (): void => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > oneHour) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);
