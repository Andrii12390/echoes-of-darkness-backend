import { IsInt, IsNotEmpty, IsNumber, isNumber, IsOptional, IsPositive, IsString, IsUrl, Length } from "class-validator";

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;


  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  type: string;
  
  @IsOptional()
  @IsInt()
  @IsPositive()
  lane: number;
  

  @IsOptional()
  @IsNumber()
  @IsPositive()
  strength: number;
}
