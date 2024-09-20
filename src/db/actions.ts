// src/db/actions.ts
import { eq } from 'drizzle-orm';
import { db } from './client';
import { NewTask, Task, tasks } from './schema';

// Fetch a single task by ID
export async function fetchTask(id: number): Promise<Task> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).execute();
    const task = result[0];
    if (!task) throw new Error('Task not found');
    return task;
}

// Add a new task
export async function addTask(newTask: NewTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(newTask).returning();
    return task;
}

// Update an existing task
export async function updateTask(updatedTask: Task): Promise<Task> {
    const [task] = await db.update(tasks).set(updatedTask).where(eq(tasks.id, updatedTask.id)).returning();
    return task;
}

// Delete a task by ID
export async function deleteTask(taskId: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, taskId)).execute();
}


export async function getTasks() {
    const result = await db.select().from(tasks).execute()
    if (!result) throw new Error('Tasks not found');
    return result;
}

// Mark task as completed
export async function completeTask(taskId: number): Promise<Task> {
    const [task] = await db.update(tasks)
        .set({ isCompleted: true })
        .where(eq(tasks.id, taskId))
        .returning();
    return task;
}

// Toggle task completion status
export async function toggleTaskCompletion(taskId: number): Promise<Task> {
    // Fetch the current task
    const task = await fetchTask(taskId);

    // Toggle the completion status
    const newStatus = !task.isCompleted;

    // Save the updated task back to the database
    const [updatedTask] = await db.update(tasks)
        .set({ isCompleted: newStatus })
        .where(eq(tasks.id, taskId))
        .returning();

    return updatedTask;
}