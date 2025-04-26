import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength
} from 'class-validator';

export class RegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  password: string;
}
