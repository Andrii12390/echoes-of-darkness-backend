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
import { ApiResponse } from '@nestjs/swagger';


const cardExample = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'card',
  description: 'card descriptopn',
  imageUrl: 'https://images.com/image/1',
  type: 'card type',
  lane: 1,
  strength: 10
}

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'List of cards returned successfully.',
    example: [
      cardExample
    ]
  })
  async findAll() {
    return this.cardService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 201,
    description: 'Card created successfully.',
    example: cardExample
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data.'
  })
  async create(data: CreateCardDto) {
    return this.cardService.create(data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Card returned successfully.',
    example: cardExample
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  async findById(@Param('id') id: string) {
    return this.cardService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Card deleted successfully.', example: cardExample })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  async deleteById(@Param('id') id: string) {
    return this.cardService.deleteById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Card updated successfully.', example: cardExample })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data.'
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  async updateById(@Param('id') id: string, @Body() data: UpdateCardDto) {
    return this.cardService.updateById(id, data);
  }
}
