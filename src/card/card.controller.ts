import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { CardService } from './card.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiResponse } from '@nestjs/swagger';
import { cardExample } from './examples/card.example';
import { Authorization } from 'src/common/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEffectDto } from './dto/create-effect.dto';

@Authorization()
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Returned List of cards',
    example: [cardExample]
  })
  async findAll() {
    return this.cardService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Card created', example: cardExample })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Card with this name already exists' })
  async create(@Body() data: CreateCardDto, @UploadedFile() file: Express.Multer.File) {
    return this.cardService.create(data, file);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Card returned', example: cardExample })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cardService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Card deleted', example: cardExample })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cardService.deleteById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Card updated', example: cardExample })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 409, description: 'Card with this name already exists' })
  async updateById(@Param('id', new ParseUUIDPipe()) id: string, @Body() data: UpdateCardDto, @UploadedFile() file: Express.Multer.File) {
    return this.cardService.updateById(id, data, file);
  }

  @Post('effect')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 201, description: 'Effect created', example: cardExample })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createEffect(@Body() data: CreateEffectDto) {
    return this.cardService.createEffect(data);
  }
}
