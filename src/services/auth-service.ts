import { PrismaClient, User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    
    if (existingUser) {
      const error = new Error('Registration: user with this email already exists');
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

    return user;
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      const error = new Error('Login: invalid credentials');
      (error as any).status = 401;
      throw error;
    } 

    return this.generateToken(user.id);
  }
}

export default AuthService;
