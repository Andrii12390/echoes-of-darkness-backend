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
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User successfully registered.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data.'
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.'
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegistrationDto
  ) {
    return this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User successfully loggen in.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data.'
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto
  ) {
    return this.authService.login(res, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Token successfully refreshed.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(req, res);
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth2 consent page.'
  })
  async google() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged in via Google.' })
  @ApiResponse({ status: 400, description: 'Google authentication failed.' })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.loginGoogle(res, req);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 302,
    description: 'Redirect to GitHub OAuth2 consent page.'
  })
  async github() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged in via GitHub.' })
  @ApiResponse({ status: 400, description: 'GitHub authentication failed.' })
  async githubCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.loginGithub(res, req);
  }
}
