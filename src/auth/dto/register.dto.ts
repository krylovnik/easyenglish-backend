import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(2)
    name: string
    @IsEmail()
    email: string

    @MinLength(6,{message: 'Password length should be between 6 and 20 symbols'})
    @MaxLength(20,{message: 'Password length should be between 6 and 20 symbols'})
    @IsString()
    password: string
}