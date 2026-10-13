'use client';

import { FormEvent, useState } from 'react';
import { STATUS_LABEL, Task, TaskInput, TaskStatus } from '../../lib/api';
import styles from './tasks.module.css';

type Props = {
  initial: Task | null;
  submitting: boolean;
  serverError: string;
  onSubmit: (data: TaskInput) => Promise<void>;
  onCancel: () => void;
};

export default function TaskForm({ initial, submitting, serverError, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'TODO');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? initial.dueDate.slice(0, 10) : '');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const trimmed = title.trim();
    if (!trimmed) {
      setError('Tên công việc không được để trống');
      return;
    }
    if (trimmed.length > 100) {
      setError('Tên công việc tối đa 100 ký tự');
      return;
    }
    setError('');

    await onSubmit({
      title: trimmed,
      description: description.trim() || null,
      status,
      dueDate: dueDate || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{initial ? `Sửa công việc #${initial.id}` : 'Thêm công việc'}</h2>

      <label htmlFor="title">Tên công việc *</label>
      <input id="title" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />

      <label htmlFor="description">Mô tả</label>
      <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label htmlFor="status">Trạng thái</label>
      <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </select>

      <label htmlFor="dueDate">Ngày hết hạn</label>
      <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : initial ? 'Lưu' : 'Thêm'}
        </button>
        {initial && (
          <button type="button" onClick={onCancel} disabled={submitting}>Hủy</button>
        )}
      </div>

      {(error || serverError) && <p role="alert" className={styles.error}>{error || serverError}</p>}
    </form>
  );
}