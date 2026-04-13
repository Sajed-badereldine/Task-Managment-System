import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
title: string;

@Column()
description: string;

@Column({
    type: 'enum',
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
})
status: 'todo' | 'in_progress' | 'done';

@ManyToOne(() => User, (user) => user.tasks)
assignedUser: User;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
}