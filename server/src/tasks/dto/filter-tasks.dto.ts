import { IsUUID , IsIn , IsOptional , IsInt , Min , Max, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class FilterTaskDto {
    @IsOptional()
    @IsUUID()
    assignedUserId?: string ; 

    @IsOptional()
    @IsIn(['todo' , 'in_progress' , 'done'])
    status?: 'todo' | 'in_progress' | 'done'

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number; 

    @IsOptional()
    @IsIn(['createdAt'])
    sortBy?: 'createdAt' ;

    @IsOptional()    
    @IsIn(['ASC' , 'DESC'])
    sortOrder?: 'ASC' | 'DESC' ;

    @IsOptional()
    @IsString()
    search?: string;
}