# Task Manager Project

Dự án Fullstack quản lý công việc (Task Manager) sử dụng NestJS, PostgreSQL, Prisma và Next.js.

## Ngày 1: Backend API

### Yêu cầu môi trường
- Node.js (v20 trở lên)
- Docker & Docker Compose

### Các bước cài đặt và khởi chạy

**Bước 1: Khởi động Database (PostgreSQL)**
Tại thư mục gốc, chạy lệnh:
\`\`\`bash
docker-compose up -d
\`\`\`

**Bước 2: Cấu hình và chạy Backend**
Mở terminal mới, di chuyển vào thư mục `api` và cài đặt thư viện:
\`\`\`bash
cd api
npm install
\`\`\`

Đồng bộ database và tạo dữ liệu mẫu:
\`\`\`bash
npx prisma db push
npx prisma db seed
\`\`\`

Khởi động server (chế độ dev):
\`\`\`bash
npm run start:dev
\`\`\`

API sẽ hoạt động tại địa chỉ: `http://localhost:3001`