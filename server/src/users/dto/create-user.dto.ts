import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
@IsEmail()
email: string;

@IsString()
@MinLength(8)
@Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/]).+$/, {
    message:
    'Password must contain at least one uppercase letter, one number, and one special character',
})
password: string;
}