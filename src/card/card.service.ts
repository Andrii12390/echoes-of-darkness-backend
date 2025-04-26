import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCardDto) {
    return await this.prisma.card.create({
      data
    });
  }

  async findAll() {
    return await this.prisma.card.findMany();
  }

  async findById(id: string) {
    return await this.prisma.card.findUnique({
      where: {
        id
      }
    });
  }

  async deleteById(id: string) {
    const card = await this.prisma.card.findUnique({
      where: {
        id
      }
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.prisma.card.delete({
      where: {
        id
      }
    });
  }

  async updateById(id: string, data: UpdateCardDto) {
    const card = await this.prisma.card.findUnique({
      where: {
        id
      }
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return await this.prisma.card.update({
      where: {
        id
      },
      data
    });
  }
}
