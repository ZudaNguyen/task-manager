import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên công việc phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  @MaxLength(100, { message: 'Tên công việc tối đa 100 ký tự' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Trạng thái phải là TODO, IN_PROGRESS hoặc DONE' })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn không hợp lệ (ví dụ 2026-10-20)' })
  dueDate?: string | null;
}