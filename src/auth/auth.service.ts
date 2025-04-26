import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistrationRequestDto } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { LoginRequestDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { GooglePayload } from './interfaces/google.interface';
import { GithubPayload } from './interfaces/github.interface';

@Injectable()
export class AuthService {
  private REFRESH_TOKEN_EXPIRES_IN: string;
  private ACCESS_TOKEN_EXPIRES_IN: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.REFRESH_TOKEN_EXPIRES_IN = configService.getOrThrow<string>(
      'REFRESH_TOKEN_EXPIRES_IN'
    );
    this.ACCESS_TOKEN_EXPIRES_IN = configService.getOrThrow<string>(
      'ACCESS_TOKEN_EXPIRES_IN'
    );
  }

  async register(res: Response, dto: RegistrationRequestDto) {
    const { username, email, password } = dto;

    const existedUser = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existedUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    return this.auth(res, newUser.id);
  }

  async login(res: Response, dto: LoginRequestDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = bcrypt.compare(password, user.password!);

    if (!isValid) {
      throw new NotFoundException('User not found');
    }

    return this.auth(res, user.id);
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = {
      id
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
    });

    return { accessToken, refreshToken };
  }

  async logout(res: Response) {
    this.setCookie(res, 'accessToken', '', 0);
    this.setCookie(res, 'refreshToken', '', 0);
  }

  async validate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id
        },
        select: {
          id: true
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.auth(res, user.id);
    }
  }

  async validateGoogle(data: GooglePayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (user) {
      return user;
    }

    return await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        googleId: data.googleId,
        avatarUrl: data.avatarUrl
      }
    });
  }

  async validateGithub(data: GithubPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (user) {
      return user;
    }

    return await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        githubId: data.githubId,
        avatarUrl: data.avatarUrl
      }
    });
  }

  async loginGoogle(res: Response, req: Request) {
    const data = req.user as GooglePayload;

    const user = await this.validateGoogle(data);

    this.auth(res, user.id);
    return res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  async loginGithub(res: Response, req: Request) {
    const data = req.user as GithubPayload;

    const user = await this.validateGithub(data);

    this.auth(res, user.id);
    return res.redirect(this.configService.getOrThrow<string>('FRONTEND_URL'));
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(res, 'accessToken', accessToken, 15 * 60 * 1000);

    this.setCookie(res, 'refreshToken', refreshToken, 7 * 24 * 60 * 60 * 1000);

    return accessToken;
  }

  private setCookie(
    res: Response,
    name: string,
    token: string,
    maxAgeMs: number
  ) {
    res.cookie(name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeMs
    });
  }
}
