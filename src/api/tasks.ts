// src/api/tasks.ts
import { NewTask, Task } from "@/db/schema";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined.");
}

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
};

export const addTaskApi = async (newTask: NewTask): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });
  if (!res.ok) throw new Error('Failed to add task');
  return res.json();
};

export const updateTaskApi = async (updatedTask: Task): Promise<Task> => {
  if (!updatedTask.id) {
    console.error('Error: Task ID is undefined', updatedTask); // Add error logging here
    throw new Error('Task ID is required for updating a task');
  }

  console.log('Updating task with ID:', updatedTask.id);  // Logging the task ID

  const res = await fetch(`${BASE_URL}/api/tasks/${updatedTask.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  });

  if (!res.ok) {
    console.error('Failed to update task:', res.statusText); // Add error logging for fetch failure
    throw new Error('Failed to update task');
  }

  return res.json();
};

export const deleteTaskApi = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
};

export const completeTaskApi = async (taskId: number): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/api/completeTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId }),
  });
  if (!res.ok) throw new Error('Failed to complete task');
  return res.json();
};