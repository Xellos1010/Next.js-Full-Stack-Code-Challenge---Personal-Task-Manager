// __tests__/tasks.test.ts

import {
  fetchTasks,
  fetchTaskById,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
  completeTaskApi,
  toggleTaskCompletionApi,
} from '../tasks';
import { NewTask, Task } from '@/db/schema';

// Mock fetch API
global.fetch = jest.fn();

describe('API Tasks', () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch tasks', async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Description for Test Task',
        dueDate: '2023-12-31',
        isCompleted: false,
        priority: 'Medium',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    const tasks = await fetchTasks();
    expect(tasks).toEqual(mockTasks);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/tasks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should fetch task by ID', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Description for Test Task',
      dueDate: '2023-12-31',
      isCompleted: false,
      priority: 'Medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTask,
    });

    const task = await fetchTaskById(1);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/tasks/1`);
  });

  it('should add a new task', async () => {
    const newTask: NewTask = {
      title: 'New Task',
      description: 'Description for New Task',
      dueDate: '2023-12-31',
    };

    const mockTask: Task = {
      id: 2,
      ...newTask,
      isCompleted: false,
      priority: 'Medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTask,
    });

    const addedTask = await addTaskApi(newTask);
    expect(addedTask).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
  });

  it('should update an existing task', async () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: '2023-12-31',
      isCompleted: false,
      priority: 'Medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => updatedTask,
    });

    const result = await updateTaskApi(updatedTask);
    expect(result).toEqual(updatedTask);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/tasks/${updatedTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
  });

  it('should delete a task', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await deleteTaskApi(1);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/tasks/1`, {
      method: 'DELETE',
    });
  });

  it('should complete a task', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Completed Task',
      description: 'Description for Completed Task',
      dueDate: '2023-12-31',
      isCompleted: true,
      priority: 'Medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTask,
    });

    const task = await completeTaskApi(1);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/completeTask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: 1 }),
    });
  });

  it('should toggle task completion status', async () => {
    const mockTask: Task = {
      id: 1,
      title: 'Toggle Task',
      description: 'Description for Toggle Task',
      dueDate: '2023-12-31',
      isCompleted: false,
      priority: 'Medium',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTask,
    });

    const task = await toggleTaskCompletionApi(1);
    expect(task).toEqual(mockTask);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/toggleTaskCompletion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: 1 }),
    });
  });
});
