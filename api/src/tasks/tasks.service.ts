import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: this.parseDate(dto.dueDate),
      },
    });
  }

  findAll(status?: TaskStatus) {
    return this.prisma.task.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      // Đề yêu cầu: ID hợp lệ nhưng không tồn tại phải trả về 404
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id); // Kiểm tra xem có tồn tại không trước khi update
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate !== undefined ? this.parseDate(dto.dueDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Kiểm tra xem có tồn tại không trước khi xóa
    return this.prisma.task.delete({ where: { id } });
  }

  private parseDate(value?: string | null) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    return new Date(value);
  }
}