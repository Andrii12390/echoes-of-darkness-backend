import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class GenerateContainerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fraction: string;
  cardCategory: string; 
  
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;
}
