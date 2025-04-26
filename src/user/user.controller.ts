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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Authorized() user: User) {
    return user;
  }

  @Authorization()
  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  async updatedProfile(
    @Authorized() user: User,
    @Body() data: UpdateProfileDto
  ) {
    return this.userService.updateProfile(user.id, data);
  }
}
