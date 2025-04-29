import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardType } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';

type UpdateCardPayload = UpdateCardDto & { imageUrl?: string };

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService
  ) {}

  async create(data: CreateCardDto, file: Express.Multer.File) {
    await this.ensureNameUnique(data.name);
    const { imageUrl } = this.upload.saveFile(file);
    return this.prisma.card.create({
      data: {
        ...data,
        type: data.type as CardType,
        imageUrl
      }
    });
  }

  async findAll() {
    return this.prisma.card.findMany();
  }

  async findById(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException(`Card ${id} not found`);
    return card;
  }

  async deleteById(id: string) {
    const card = await this.findById(id);
    this.upload.deleteFile(card.imageUrl);
    return this.prisma.card.delete({ where: { id } });
  }

  async updateById(id: string, data: UpdateCardDto, file?: Express.Multer.File) {
    const existing = await this.findById(id);

    if (data.name && data.name !== existing.name) {
      await this.ensureNameUnique(data.name);
    }

    const updatedData: UpdateCardPayload = { ...data }

    if (file) {
      this.upload.deleteFile(existing.imageUrl);
      const { imageUrl } = this.upload.saveFile(file);
      updatedData.imageUrl = imageUrl;
    }


    return this.prisma.card.update({
      where: { id },
      data: updatedData
    });
  }

  private async ensureNameUnique(name: string) {
    const found = await this.prisma.card.findFirst({ where: { name } });
    if (found) {
      throw new ConflictException(`Card with name "${name}" already exists`);
    }
  }
}
