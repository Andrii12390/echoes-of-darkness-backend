import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { CardService } from './card.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.cardService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(data: CreateCardDto) {
    return this.cardService.create(data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.cardService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: string) {
    return this.cardService.deleteById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: string, @Body() data: UpdateCardDto) {
    return this.cardService.updateById(id, data);
  }
}
