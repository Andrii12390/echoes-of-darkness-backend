import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Authorization } from 'src/common/decorators/auth.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { userExample } from './examples';
import { FileInterceptor } from '@nestjs/platform-express';

@Authorization()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Authorization()
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Returned the authenticated user profile', example: userExample })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Authorized() user: User) {
    return user;
  }

  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Profile updated', example: userExample })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatedProfile(@Authorized() user: User, @Body() data: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfile(user, data, file);
  }

  @Get('card')
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findAllCards(@Authorized() user: User) {
    return this.userService.findAllCards(user.id);
  }
}
