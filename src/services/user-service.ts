import { PrismaClient } from '@prisma/client';
import { type TSafeUser } from '../types';
import bcrypt from 'bcryptjs';

class UserService {
  private prisma: PrismaClient = new PrismaClient();

  async updateProfile(
    userEmail: string,
    username?: string,
    password?: string,
    avatarUrl?: string
  ): Promise<TSafeUser | null> {
    const data = {
      ...(username && { username }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
      ...(avatarUrl && { avatarUrl }),
    };

    if (Object.keys(data).length === 0) return null;

    const { id, email, username: name, avatarUrl: avatar } =
      await this.prisma.user.update({
        where: { email: userEmail },
        data,
        select: { id: true, email: true, username: true, avatarUrl: true }
      });

    return { id, email, username: name, avatarUrl: avatar };
  }
}

export default UserService;
