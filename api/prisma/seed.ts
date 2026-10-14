import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.task.count();
  if (count > 0) {
    console.log(`Đã có ${count} công việc, bỏ qua seed.`);
    return;
  }

  await prisma.task.createMany({
    data: [
      { title: 'Cài đặt môi trường Node và Docker', status: TaskStatus.DONE },
      { title: 'Viết schema Prisma cho Task', status: TaskStatus.DONE },
      { title: 'Làm API tạo và liệt kê công việc', status: TaskStatus.IN_PROGRESS, description: 'POST và GET /tasks' },
      { title: 'Làm trang /tasks bằng Next.js', status: TaskStatus.TODO, dueDate: new Date('2026-10-20') },
      { title: 'Viết Dockerfile và README', status: TaskStatus.TODO, dueDate: new Date('2026-10-22') },
      { title: 'Chuẩn bị buổi đánh giá cuối', status: TaskStatus.TODO },
    ],
  });
  console.log('Đã tạo dữ liệu mẫu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());