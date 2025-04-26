import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  avatarUrl?: string;
}
