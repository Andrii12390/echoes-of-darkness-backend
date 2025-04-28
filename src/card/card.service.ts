import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { CardType } from '@prisma/client';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCardDto) {
    await this.checkByName(data.name);

    return await this.prisma.card.create({
      data: {
        ...data,
        type: data.type as CardType
      }
    });
  }

  async findAll() {
    return await this.prisma.card.findMany();
  }

  async findById(id: string) {
    const card = await this.prisma.card.findUnique({
      where: {
        id
      }
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async deleteById(id: string) {
    await this.findById(id);

    return await this.prisma.card.delete({
      where: {
        id
      }
    });
  }

  async updateById(id: string, data: UpdateCardDto) {
    await this.findById(id);
    
    if(data.name) {
      await this.checkByName(data.name);
    }

    const { type, ...rest } = data;

    const updateData = {
      ...rest,
      ...(type !== undefined && { type: type as CardType })
    };

    return this.prisma.card.update({
      where: { id },
      data: updateData
    });
  }

  private async checkByName(name: string) {
    const existedCard = await this.prisma.card.findFirst({ where: { name } });

    if (existedCard) {
      throw new ConflictException('Card with this name already exists');
    }
  }
}
