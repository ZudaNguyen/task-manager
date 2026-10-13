export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'Chưa làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Hoàn thành',
};

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',
  });

  if (!res.ok) {
    let message = `Lỗi ${res.status}`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join('. ') : (body.message ?? message);
    } catch {
      // lỗi
    }
    throw new Error(message);
  }
  return res.json();
}

export const getTasks = (params: { status?: TaskStatus; search?: string } = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  const q = qs.toString();
  return request<Task[]>(`/tasks${q ? `?${q}` : ''}`);
};

export const createTask = (data: TaskInput) =>
  request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) });

export const updateTask = (id: number, data: Partial<TaskInput>) =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteTask = (id: number) =>
  request<Task>(`/tasks/${id}`, { method: 'DELETE' });