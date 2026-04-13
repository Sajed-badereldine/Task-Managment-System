import { IsString , IsUUID } from 'class-validator';

export class CreateTaskDto {
@IsString()
title: string ; 

@IsString()
description: string ; 

@IsUUID()
assignedUserId: string ; 

}