import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  ArrayNotEmpty,
  ValidateNested,
  IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DropDto {
  @ApiProperty()
  @IsUUID()
  cardId: string;

  @ApiProperty()
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
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
  
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DropDto)
  drops: DropDto[];
}
