import { Controller, Body, Get, Post, Delete, Param, HttpCode, HttpStatus, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';

import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';

import { containerExample, dropExample, cardExample } from './examples';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { User } from '@prisma/client';
import { Authorization } from 'src/common/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Authorization()
@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'List containers',
    example: [containerExample]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.containerService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Get container',
    example: containerExample
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.containerService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Create container',
    example: containerExample
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateContainerDto, @UploadedFile() file: Express.Multer.File) {
    return this.containerService.createContainer(dto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Delete container' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.containerService.deleteContainer(id);
  }

  @Get(':id/drops')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Get drops', example: dropExample })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findDrops(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.containerService.getDropsByContainerId(id);
  }

  @Post(':id/open')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Open container',
    example: cardExample
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not enough money' })
  open(@Param('id', new ParseUUIDPipe()) id: string, @Authorized() user: User) {
    return this.containerService.openContainer(user, id);
  }
}
