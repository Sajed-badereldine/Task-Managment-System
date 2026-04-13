import {
Injectable,
NotFoundException,
ConflictException,
OnModuleInit, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class UsersService implements OnModuleInit {
constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
) {}


async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
        console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables');
        return;
    }

    const existingAdmin = await this.usersRepository.findOne({
        where: { email: adminEmail },
        select: {
            id: true,
            email: true,
        },
    });

    if (existingAdmin) {
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = this.usersRepository.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved',
    });

    await this.usersRepository.save(admin);

    console.log('Default admin account created');
}

async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
    email: createUserDto.email,
    });

    if (existingUser) {
        throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
        role: 'user',
        status: 'pending',
    });

    return this.usersRepository.save(user);
}

findAll() {
    return this.usersRepository.find();
}

async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
}

async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email !== undefined) {
        user.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
        user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.save(user);
}

async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
}

async findByEmail(email : string) {
    return this.usersRepository.findOne({
        where: {
            email
        } , 
        select: {
            id: true,
            email: true,
            password: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
    },
    })
}

async findPendingUsers()  {
    const users = this.usersRepository.find({
        where : {
            status : 'pending'
        }
    })
    return users 
}

async approveUser(id: string) {
    const user = await this.findOne(id)
    user.status = 'approved'
    return this.usersRepository.save(user)

}

async rejectUser(id: string) {
    const user = await this.findOne(id)
    user.status = 'rejected'
    return this.usersRepository.save(user) 
}   

}