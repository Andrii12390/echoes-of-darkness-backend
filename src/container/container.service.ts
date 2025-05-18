import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { Container, ContainerDrop, Card, User } from '@prisma/client';
import { GenerateContainerDto } from './dto/generate-container.dto';
import { containers } from './data/containers.data';

@Injectable()
export class ContainerService {
  constructor(private readonly prisma: PrismaService) {}

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
  async deleteContainer(id: string): Promise<Container> {
    return this.prisma.container.delete({ where: { id } });
  }

  private getRandomDrop(drops: (ContainerDrop & { card: Card })[]): ContainerDrop & { card: Card } {
    const rand = Math.floor(Math.random() * 100) + 1;
    let cumulative = 0;

    for (const d of drops) {
      cumulative += Number(d.dropChancePct);
      if (rand <= cumulative) {
        return d;
      }
    }

    return drops[drops.length - 1];
  }

  async createContainer(data: CreateContainerDto): Promise<Container & { drops: ContainerDrop[] }> {
    const total = data.drops.reduce((sum, d) => sum + d.dropChancePct, 0);

    if (Math.abs(total - 1) > 1e-6) {
      throw new BadRequestException(`Sum of chances must be equal to 1.0, current: ${total.toFixed(6)}`);
    }

    return this.prisma.container.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        drops: {
          create: data.drops.map(d => ({ card: { connect: { id: d.cardId } }, dropChancePct: d.dropChancePct }))
        }
      },
      include: { drops: true }
    });
  }

  async generateContainers(): Promise<(Container & { drops: ContainerDrop[] })[]> {
    const createdContainers: (Container & { drops: ContainerDrop[] })[] = [];

    for (const dto of containers) {
      if (dto.price < 300 || dto.price > 1000) {
        throw new BadRequestException(`Price for "${dto.name}" must be between 300 and 1000.`);
      }

      const cards = await this.prisma.card.findMany({
        where: {
          fraction: dto.fraction,
          cardCategory: dto.cardCategory,
          isLeader: false
        },
        select: { id: true }
      });

      if (cards.length === 0) {
        throw new BadRequestException(`No cards for fraction="${dto.fraction}" and category="${dto.cardCategory}"`);
      }
      const chancePct = Number((1 / cards.length).toFixed(4)) * 100;
      const dropsData = cards.map(c => ({ cardId: c.id, dropChancePct: chancePct }));

      const container = await this.prisma.container.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          drops: { create: dropsData }
        },
        include: { drops: true }
      });

      createdContainers.push(container);
    }
    return createdContainers;
  }
}
