import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { SpecialEffectType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEffectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

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
  @IsEnum(SpecialEffectType)
  type: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  power: number;
}