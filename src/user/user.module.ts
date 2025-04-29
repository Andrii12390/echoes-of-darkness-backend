import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule.forFeature('avatars'),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
