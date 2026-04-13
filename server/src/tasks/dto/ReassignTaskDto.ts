import { IsUUID } from 'class-validator';

export class ReassignTaskDto {

@IsUUID()
assignedUserId: string ; 
}