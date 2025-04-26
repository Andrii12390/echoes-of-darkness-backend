import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Authorization } from 'src/common/decorators/auth.decorator';
import { ApiResponse } from '@nestjs/swagger';

const userExample = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  username: 'username',
  email: 'email@gmail.com',
  avatarUrl: 'https://avatar.com/avatar/1',
  googleId: '123e4567-e89b-12d3-a456-426614174001',
  githubId: '123e4567-e89b-12d3-a456-426614174001',
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile.',
    example: userExample
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Authorized() user: User) {
    return user;
  }

  @Authorization()
  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    example: userExample
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data.'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updatedProfile(
    @Authorized() user: User,
    @Body() data: UpdateProfileDto
  ) {
    return this.userService.updateProfile(user.id, data);
  }
}
