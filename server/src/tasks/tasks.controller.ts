import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/UpdateTaskStatusDto';
import {
Controller,
Get,
Post,
Body,
Patch,
Param,
UseGuards,
Delete,
Query, 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {AuthenticatedUser} from '../common/interfaces/authenticated-user.interface'
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReassignTaskDto } from './dto/ReassignTaskDto';
import { FilterTaskDto } from './dto/filter-tasks.dto';

@Controller('tasks')
export class TasksController {
constructor(private readonly tasksService: TasksService) {}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post()
create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
}

@UseGuards(JwtAuthGuard)
@Get('my')
findMyTasks(@CurrentUser() user:AuthenticatedUser) {
    return this.tasksService.findMyTasks(user.id);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/status')
updateTaskStatus(
    @Param('id') taskId: string,
    @CurrentUser() user:AuthenticatedUser,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
) {
    return this.tasksService.updateTaskStatus(
    taskId,
    user.id,
    updateTaskStatusDto,
    );
}

@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('admin')
@Get()
findAllTasks(@Query() filterTaskDto:FilterTaskDto) {
    return this.tasksService.findAllTasks(filterTaskDto)
}

@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('admin')
@Patch(':id')
updateTask(@Param('id') id:string , @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id , updateTaskDto)
}


@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('admin')
@Delete(':id')
removeTask(@Param('id') id:string){
    return this.tasksService.removeTask(id)
}

@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('admin')
@Patch(':id/reassign')
reassignTask(@Param('id') id:string , @Body() reassignTaskDto:ReassignTaskDto ){
    return this.tasksService.reassignTask(id , reassignTaskDto)
}

}