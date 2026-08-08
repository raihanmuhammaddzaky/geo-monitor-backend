import multer from 'multer';
import path from 'path';

// --- KONFIGURASI MULTER (Untuk Upload Foto) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // Pastikan folder public/uploads/ sudah ada
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

export const upload = multer({ storage: storage });
