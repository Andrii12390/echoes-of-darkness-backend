import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule.forFeature('containers'),
  ],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
