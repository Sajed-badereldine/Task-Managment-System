import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
OneToMany,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
email: string;

@Column({ select: false })
password: string;

@Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
})
role: 'admin' | 'user';

@Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
})
status: 'pending' | 'approved' | 'rejected';

@OneToMany(() => Task, (task) => task.assignedUser)
tasks: Task[];

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
}