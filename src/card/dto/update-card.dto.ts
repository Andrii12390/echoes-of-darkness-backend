import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsEnum(CardType)
  type?: CardType;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  lane?: number;

  
  @ApiProperty()
  @Type(() => Number) 
  @IsOptional()
  @IsNumber()
  @IsPositive()
  strength?: number;
}
