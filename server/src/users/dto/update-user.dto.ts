import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
@IsOptional()
@IsEmail()
email?: string;

@IsOptional()
@IsString()
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/]).+$/, {
    message:
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
})
password?: string;
}