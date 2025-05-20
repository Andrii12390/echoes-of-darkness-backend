import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchResult } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async getBotDeck() {
    const FRACTIONS = [
      'Order of the Shining Sun',
      'Conclave of Sorcerers',
      'Cult of Shadows',
      'Golden Syndicate',
      'Legion of Chaos',
      'Guardians of Nature'
    ];

    const randomFraction = FRACTIONS[Math.floor(Math.random() * FRACTIONS.length)];

    return await this.prisma.card.findMany({
      where: { fraction: randomFraction },
      include: {
        specialEffect: true 
      }
    });
  }

  async finishMatch(userId: string, result: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reward = result === 'WIN' ? { gold: 100, exp: 30 } : { gold: 50, exp: 15 };

    let currentExp = user.experienceCurrent + reward.exp;
    let level = user.level;
    let nextThresh = user.experienceToNext;

    while (currentExp >= nextThresh) {
      currentExp -= nextThresh;
      level += 1;
      nextThresh = level * 100;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        currencyBalance: { increment: reward.gold },
        experienceCurrent: currentExp,
        experienceToNext: nextThresh,
        level: level
      }
    });

    await this.prisma.match.create({
      data: {
        userId,
        result: result as MatchResult
      }
    });

    return {
      newBalance: updated.currencyBalance,
      experienceCurrent: updated.experienceCurrent,
      experienceToNext: updated.experienceToNext,
      newLevel: updated.level
    };
  }
}
