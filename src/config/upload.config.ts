import { MulterModuleOptions } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function createMulterOptions(): MulterModuleOptions {
  return {
    storage: memoryStorage(),          
    fileFilter: (_req, file, cb) => {
      const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
      cb(null, allowed.includes(ext));
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  };
}
