import {
Injectable,
NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UpdateTaskStatusDto} from './dto/UpdateTaskStatusDto'
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReassignTaskDto } from './dto/ReassignTaskDto';
import { FilterTaskDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly tasksRepository : Repository <Task> 
) {}

    async create(createTaskDto : CreateTaskDto) {
        const user = await this.usersRepository.findOneBy({id: createTaskDto.assignedUserId})
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const task = this.tasksRepository.create ({
            title: createTaskDto.title , 
            description : createTaskDto.description , 
            assignedUser: user , 
        }) 
        return this.tasksRepository.save(task)
    }

    async findMyTasks(userId: string) {
        const tasks = await this.tasksRepository.find({
        where: {
            assignedUser: {
            id: userId,
        },
    },
        relations: {
            assignedUser: true,
    },
    });

        return tasks;
    }

async updateTaskStatus(
    taskId: string,
    userId: string,
    dto: UpdateTaskStatusDto,
) {
    const task = await this.tasksRepository.findOne({
        where: {
            id: taskId,
            assignedUser: {
            id: userId,
            },
        },
        relations: {
            assignedUser: true,
        },
    });

    if (!task) {
        throw new NotFoundException('Task not found or not assigned to this user');
    }

    task.status = dto.status;

        return this.tasksRepository.save(task);
    }

    async findAllTasks(filterTaskDto: FilterTaskDto) {
        const {
            status,
            assignedUserId,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            } = filterTaskDto;

        const skip = (page - 1) * limit;

        const query = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignedUser', 'assignedUser');

        if (status !== undefined) {
            query.andWhere('task.status = :status', { status });
    }

        if (assignedUserId !== undefined) {
            query.andWhere('assignedUser.id = :assignedUserId', { assignedUserId });
    }

        if (search !== undefined && search.trim() !== '') {
            query.andWhere('LOWER(task.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
        });
    }

        query.orderBy(`task.${sortBy}`, sortOrder);
        query.skip(skip).take(limit);

        const [tasks, total] = await query.getManyAndCount();

    return {
        data: tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

    async removeTask(taskId : string) {
        const task = await this.tasksRepository.findOneBy({id : taskId})
        if (!task) {
            throw new NotFoundException('Task not found')
        }
        return this.tasksRepository.remove(task)
    }

async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
        throw new NotFoundException('Task not found');
    }

    if (updateTaskDto.title !== undefined) {
        task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
        task.description = updateTaskDto.description;
    }

    return this.tasksRepository.save(task);
}

async reassignTask(taskId: string, reassignTaskDto: ReassignTaskDto) {
    const task = await this.tasksRepository.findOneBy({id:taskId})
    
    if (!task) {
        throw new NotFoundException('Task not found');
    }
    
    const newuser = await this.usersRepository.findOneBy({id:reassignTaskDto.assignedUserId})

    if(!newuser) {
        throw new NotFoundException("User does not exist")
    }

    task.assignedUser = newuser

    return this.tasksRepository.save(task)
}

}
