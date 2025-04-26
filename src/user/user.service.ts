import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(id: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }
}
