import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { Container, ContainerDrop, Card, User } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ContainerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService
  ) {}

  private async loadContainer(id: string, includeDrops = false): Promise<Container & { drops?: (ContainerDrop & { card: Card })[] }> {
    const container = await this.prisma.container.findUnique({
      where: { id },
      include: includeDrops ? { drops: { include: { card: true } } } : undefined
    });

    if (!container) {
      throw new NotFoundException(`Container with id=${id} not found`);
    }

    return container;
  }

  private async addCardToUser(userId: string, cardId: string) {
    return this.prisma.userCard.upsert({
      where: { userId_cardId: { userId, cardId } },
      create: { userId, cardId, acquiredAt: new Date() },
      update: {}
    });
  }

  async findAll(): Promise<(Container & { drops: ContainerDrop[] })[]> {
    return this.prisma.container.findMany({ include: { drops: true } });
  }

  async findById(id: string): Promise<Container> {
    return this.loadContainer(id, false);
  }

  async getDropsByContainerId(id: string): Promise<(ContainerDrop & { card: Card })[]> {
    const container = await this.loadContainer(id, true);
    return container.drops!;
  }

  async openContainer(user: User, id: string): Promise<Card> {
    const container = await this.loadContainer(id, true);

    if (user.currencyBalance < container.price) {
      throw new ForbiddenException('Not enough money');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { currencyBalance: { decrement: container.price } }
    });

    const drop = this.getRandomDrop(container.drops!);

    await this.addCardToUser(user.id, drop.cardId);

    return drop.card;
  }

  async createContainer(data: CreateContainerDto, file: Express.Multer.File): Promise<Container & { drops: ContainerDrop[] }> {
    const { imageUrl } = this.upload.saveFile(file);
    
    const total = data.drops.reduce((sum, d) => sum + d.dropChancePct, 0);

    if (Math.abs(total - 1) > 1e-6) {
      throw new BadRequestException(`Sum of chances must be equal to 1.0, current: ${total.toFixed(6)}`);
    }

    return this.prisma.container.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl,
        drops: {
          create: data.drops.map(d => ({ card: { connect: { id: d.cardId } }, dropChancePct: d.dropChancePct }))
        }
      },
      include: { drops: true }
    });
  }

  async deleteContainer(id: string): Promise<Container> {
    const container = await this.loadContainer(id);
    this.upload.deleteFile(container.imageUrl);
    
    return this.prisma.container.delete({ where: { id } });
  }

  private getRandomDrop(drops: (ContainerDrop & { card: Card })[]): ContainerDrop & { card: Card } {
    const totalWeight = drops.reduce((sum, d) => sum + +d.dropChancePct, 0);
    let random = Math.random() * totalWeight;
    let chosen = drops[0];

    for (const d of drops) {
      random -= +d.dropChancePct;

      if (random <= 0) {
        chosen = d;
        break;
      }
    }
    return chosen;
  }
}
