import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description?: string;

  @ApiProperty()
  @IsString()
  @IsEnum(CardType)
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardCategory: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  health?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  strength: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isLeader?: boolean;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  fraction: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialEffectId?: string;
}