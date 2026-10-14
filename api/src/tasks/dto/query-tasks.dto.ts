import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class QueryTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Trạng thái phải là TODO, IN_PROGRESS hoặc DONE' })
  status?: TaskStatus;
}