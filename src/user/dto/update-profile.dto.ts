import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  frame?: string;
}
