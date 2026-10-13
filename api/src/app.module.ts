import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TaskModule } from './task/task.module.js';
import { TasksController } from './tasks/tasks.controller.js';
import { TasksService } from './tasks/tasks.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TaskModule],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService],
})
export class AppModule {}