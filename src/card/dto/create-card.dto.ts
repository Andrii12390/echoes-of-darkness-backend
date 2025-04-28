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

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @IsString()
  @IsEnum(CardType)
  type: string;

  @IsInt()
  @IsPositive()
  lane: number;

  @IsNumber()
  @IsPositive()
  strength: number;
}
