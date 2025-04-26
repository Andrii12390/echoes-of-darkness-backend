import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegistrationRequestDto } from './dto/registration.dto';
import { LoginRequestDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegistrationRequestDto
  ) {
    return this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequestDto
  ) {
    return this.authService.login(res, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.loginGoogle(res, req);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  async github() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  async githubCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.loginGithub(res, req);
  }
}
