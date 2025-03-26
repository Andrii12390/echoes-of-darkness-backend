import { PrismaClient, Card } from '@prisma/client';

export default class CardService {
  private prisma: PrismaClient = new PrismaClient();

  getCards(): Promise<Card[]> {
    return this.prisma.card.findMany();
  }

  addCard(
    imageUrl: string,
    name: string,
    type: string,
    lane: string,
    description: string,
    strength: number
  ): Promise<Card> {
    return this.prisma.card.create({
      data: {
        imageUrl,
        name,
        type,
        lane,
        strength,
        description,
      },
    });
  }
}
