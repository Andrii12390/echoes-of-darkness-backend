import { PrismaClient, User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IGoogleProfile {
  googleId: string;
  email: string;
  username: string;
  avatarUrl?: string; 
}

type TSafeUser = Pick<User, 'id' | 'email' | 'username' | 'avatarUrl'>;

class AuthService {
  private prisma: PrismaClient = new PrismaClient();

  private generateToken(userId: number) {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<[User, string]> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error(
        'Registration: user with this email already exists'
      );
      (error as any).status = 400;
      throw error;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return [user, this.generateToken(user.id)];
  }

  async loginWithCredentials(
    email: string,
    password: string
  ): Promise<[User, string]> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcryptjs.compare(password, user.password!))) {
      const error = new Error('Login: invalid credentials');
      (error as any).status = 401;
      throw error;
    }

    return [user, this.generateToken(user.id)];
  }

  async loginWithGoogle(profile: IGoogleProfile): Promise<string> {
    let user = await this.prisma.user.findFirst({
      where: { googleId: profile.googleId },
    });
  
    if (user) return this.generateToken(user.id);
  
    user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
  
    if (user) {
      user = await this.prisma.user.update({
        where: { email: profile.email },
        data: {
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl ?? user.avatarUrl
        },
      });
      return this.generateToken(user.id);
    }
  
    user = await this.prisma.user.create({
      data: {
        googleId: profile.googleId,
        email: profile.email,
        username: profile.username,
        avatarUrl: profile.avatarUrl || undefined,
      },
    });
  
    return this.generateToken(user.id);
  }

  async getSafeUserById(userId: number): Promise<TSafeUser | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true
      },
    });
  }
}

export default AuthService;
