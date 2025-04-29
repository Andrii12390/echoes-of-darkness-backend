import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ArrayNotEmpty,
  ValidateNested,
  IsUUID,
  IsArray
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DropDto {
  @ApiProperty()
  @IsUUID()
  cardId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  dropChancePct: number;
}

export class CreateContainerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty()
  
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({ 
    type: [DropDto], 
    description: 'JSON array of drops (if multipart/form-data — передавайте як string)' 
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    return typeof value === 'string' ? JSON.parse(value) : value;
  })
  @ValidateNested({ each: true })
  @Type(() => DropDto)
  drops: DropDto[];
}
