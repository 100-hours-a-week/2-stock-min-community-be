import multer from 'multer';

import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = (storagePath) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `uploads/${storagePath}`));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname); // 확장자 추출
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'); // 파일명 안전 처리
      cb(null, `${uniqueSuffix}-${safeName}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
};
export const upload = (storagePath) =>
  multer({
    storage: storage(storagePath),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
