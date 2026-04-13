import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService ,
        private readonly jwtService: JwtService,
    ) {}

    signup(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto); 
    }

    async login(loginUserDto : LoginUserDto) {
        const user = await this.usersService.findByEmail(loginUserDto.email)
        if (!user) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const IspasswordMatched = await bcrypt.compare(
            loginUserDto.password , user.password
        )

        if (!IspasswordMatched) {
            throw new UnauthorizedException('Invalid email or paswword')
        }

        if (user.status !== 'approved') {
            throw new  UnauthorizedException('Your account is not approved yet')
        }

        const payload = {
            sub: user.id , 
            email:user.email , 
            role: user.role , 
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
