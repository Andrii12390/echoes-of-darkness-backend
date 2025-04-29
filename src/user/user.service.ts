import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';

type UpdateProfilePayload = UpdateProfileDto & { avatarUrl?: string };

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService
  ) {}

  async updateProfile(user: User, data: UpdateProfileDto, file?: Express.Multer.File) {
    const updatedData: UpdateProfilePayload = { ...data };

    if (file) {
      if (user.avatarUrl) {
        this.upload.deleteFile(user.avatarUrl);
      }

      const { imageUrl } = this.upload.saveFile(file);
      updatedData.avatarUrl = imageUrl;
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: updatedData
    });
  }

  async findAllCards(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        cards: {
          include: {
            card: true
          }
        }
      }
    });
  }
}
