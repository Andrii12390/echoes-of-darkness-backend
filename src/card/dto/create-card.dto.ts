import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

import { CardType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @ApiProperty()
  @IsString()
  @IsEnum(CardType)
  type: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  lane: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  strength: number;
}
