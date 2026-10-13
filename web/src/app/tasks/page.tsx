'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  STATUS_LABEL, Task, TaskInput, TaskStatus,
  createTask, deleteTask, getTasks, updateTask,
} from '../../lib/api';
import TaskForm from './TaskForm';
import styles from './tasks.module.css';

const FILTERS: { label: string; value?: TaskStatus }[] = [
  { label: 'Tất cả' },
  { label: 'Chưa làm', value: 'TODO' },
  { label: 'Đang làm', value: 'IN_PROGRESS' },
  { label: 'Hoàn thành', value: 'DONE' },
];

function messageOf(e: unknown) {
  if (e instanceof TypeError) return 'Không kết nối được tới API. Hãy kiểm tra backend đã chạy chưa.';
  return e instanceof Error ? e.message : 'Có lỗi xảy ra';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Task | null>(null);
  const [formKey, setFormKey] = useState(0); 
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await getTasks({ status: filter }));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(task: Task | null) {
    setEditing(task);
    setFormError('');
    setFormKey((k) => k + 1);
  }

  async function handleSubmit(data: TaskInput) {
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) await updateTask(editing.id, data);
      else await createTask(data);
      startEdit(null);
      await load();
    } catch (e) {
      setFormError(messageOf(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Xóa công việc "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      if (editing?.id === task.id) startEdit(null);
      await load();
    } catch (e) {
      setError(messageOf(e));
    }
  }

  return (
    <main className={styles.page}>
      <h1>Quản lý công việc</h1>

      <TaskForm
        key={formKey}
        initial={editing}
        submitting={submitting}
        serverError={formError}
        onSubmit={handleSubmit}
        onCancel={() => startEdit(null)}
      />

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? styles.active : ''}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error} <button onClick={load}>Thử lại</button>
        </p>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : tasks.length === 0 && !error ? (
        <p>Chưa có công việc nào.</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} className={styles.item}>
              <strong>{t.title}</strong>{' '}
              <span className={styles.badge}>{STATUS_LABEL[t.status]}</span>
              {t.description && <p>{t.description}</p>}
              {t.dueDate && (
                <small>Hạn: {new Date(t.dueDate).toLocaleDateString('vi-VN', { timeZone: 'UTC' })}</small>
              )}
              <div className={styles.actions}>
                <button onClick={() => startEdit(t)}>Sửa</button>
                <button onClick={() => handleDelete(t)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}