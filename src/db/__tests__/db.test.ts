// tests/db.test.ts
import {
  addTask,
  deleteTask,
  fetchTask,
  getTasks,
  toggleTaskCompletion,
  updateTask
} from '@/db/actions';
import { db } from '@/db/client';
import { NewTask, Task } from '@/db/schema';
import { sql } from 'drizzle-orm';

beforeEach(async () => {
  await db.run(sql`DELETE FROM tasks`);
});

describe('DB Actions', () => {
  describe('Sequential Task Execution', () => {
    it('should perform a series of operations on tasks', async () => {
      // Step 1: Add a new task
      const newTask: NewTask = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date().toISOString(),
        isCompleted: false,
        priority: 'Medium',
        createdAt: new Date().toISOString(),
      };

      const addedTask = await addTask(newTask);
      expect(addedTask.title).toBe(newTask.title);

      // Step 2: Get the ID of the newly added task
      const taskId = addedTask.id;

      // Step 3: Fetch all tasks
      const fetchedTasks = await getTasks();
      expect(fetchedTasks).toHaveLength(1);

      // Step 4: Fetch the task by ID
      const fetchedTask = await fetchTask(taskId);
      expect(fetchedTask.title).toBe(newTask.title);

      // Step 5: Update the task by ID
      const updatedTask: Task = { ...addedTask, title: 'Updated Test Task' };
      const resultUpdate = await updateTask(updatedTask);
      expect(resultUpdate.title).toBe(updatedTask.title);

      // Step 6: Toggle the completion status of the task
      const toggledTask = await toggleTaskCompletion(taskId);
      expect(toggledTask.isCompleted).toBe(!addedTask.isCompleted);

      // Step 7: Delete the task by ID
      await deleteTask(taskId);
      const remainingTasks = await getTasks();
      expect(remainingTasks).toHaveLength(0);
    });
  });

  // Other describe blocks...
});
