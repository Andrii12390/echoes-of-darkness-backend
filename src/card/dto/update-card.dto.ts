import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length
} from 'class-validator';

export class UpdateCardDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsEnum(CardType)
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  lane: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  strength: number;
}
