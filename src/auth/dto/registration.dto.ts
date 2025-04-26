import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class RegistrationRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  username: string;
  
  @IsString() 
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 100)  
  password: string;
}
