import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  constructor(@Inject('UPLOAD_SUBFOLDER') private readonly subfolder: string) {}

  saveFile(file: Express.Multer.File) {
    const ext = path.extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', this.subfolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const imageUrl = `/uploads/${this.subfolder}/${filename}`;
    return { filename, imageUrl };
  }

  deleteFile(imageUrl: string) {
    try {
      const filename = path.basename(imageUrl);
      const filePath = path.join(process.cwd(), 'uploads', this.subfolder, filename);
      fs.unlinkSync(filePath);
    } catch {}
  }
}
