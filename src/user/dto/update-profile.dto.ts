import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

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
  @IsUrl()
  avatarUrl?: string;
}
