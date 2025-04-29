import { DynamicModule, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { createMulterOptions } from '../config/upload.config';
import { UploadService } from './upload.service';

@Module({})
export class UploadModule {
  static forFeature(subfolder: string): DynamicModule {
    return {
      module: UploadModule,
      imports: [MulterModule.register(createMulterOptions())],
      providers: [{ provide: 'UPLOAD_SUBFOLDER', useValue: subfolder }, UploadService],
      exports: [MulterModule, UploadService]
    };
  }
}
