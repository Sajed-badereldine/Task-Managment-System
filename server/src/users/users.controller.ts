import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {AuthenticatedUser} from '../common/interfaces/authenticated-user.interface'

@Controller('users')
export class UsersController {
    constructor(private readonly userservices : UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user:AuthenticatedUser) {
        return user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('pending')
    findPendingUsers() {
        return this.userservices.findPendingUsers();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/approve')
    approveUser(@Param('id') id: string) {
        return this.userservices.approveUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/reject')
    rejectUser(@Param('id') id: string) {
    return this.userservices.rejectUser(id);
    }

    @UseGuards(JwtAuthGuard , RolesGuard)
    @Roles('admin')
    @Get()
    findAll() {
        return this.userservices.findAll()
    }

    @UseGuards(JwtAuthGuard , RolesGuard)
    @Roles('admin')
    @Get(':id') 
    findOne(@Param('id') id :string) {
        return this.userservices.findOne(id);
    }

    @UseGuards(JwtAuthGuard , RolesGuard)
    @Roles('admin')
    @Patch(':id')
    update(@Param('id') id:string , @Body() updateUserDto : UpdateUserDto) {
        return this.userservices.update(id , updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.userservices.remove(id);
    }

}
