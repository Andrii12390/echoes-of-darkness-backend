import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
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
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(CardType)
  type?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  health?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  strength?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isLeader?: boolean;


  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  fraction?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  specialEffectId?: string;
}
