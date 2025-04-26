import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
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
  @IsUrl()
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
  @IsNotEmpty()
  @Length(2, 50)
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
