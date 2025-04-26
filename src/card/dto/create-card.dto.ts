import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  type: string;

  @IsInt()
  @IsPositive()
  lane: number;

  @IsNumber()
  @IsPositive()
  strength: number;
}
