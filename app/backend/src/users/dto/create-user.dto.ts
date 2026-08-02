import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'پسورد باید حداقل ۶ کاراکتر باشد' })
  password: string;
  @IsNotEmpty()
  name: string;
}
