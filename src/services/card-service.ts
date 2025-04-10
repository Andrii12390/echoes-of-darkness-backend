import { PrismaClient, Card } from '@prisma/client';

interface ICard {
  imageUrl: string;
  name: string;
  type: string;
  lane: string;
  description: string;
  strength: number;
}

class CardService {
  private prisma: PrismaClient = new PrismaClient();

  getCards(): Promise<Card[]> {
    return this.prisma.card.findMany();
  }

  addCard({
    imageUrl,
    name,
    type,
    lane,
    description,
    strength,
  }: ICard): Promise<Card> {
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

export default CardService;
