import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class RegisterDTO {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({}, {message: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.'})
    password: string;
}