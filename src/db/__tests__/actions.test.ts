// src/db/__tests__/actions.test.ts
import { addTask, deleteTask, fetchTask, getTasks, updateTask } from '../actions';
import { db } from '../client'; // Mock the db client
import { NewTask, Task, tasks } from '../schema';

// Mock the database methods
jest.mock('../client', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(),
        execute: jest.fn(),
      })),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(),
      execute: jest.fn(),
    })),
    update: jest.fn(() => ({
      set: jest.fn(),
      where: jest.fn(),
      execute: jest.fn(),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(),
      execute: jest.fn(),
    })),
  },
}));

describe('DB Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTask', () => {
    it('should fetch a task by ID', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date().toISOString(),  // Convert Date to string
        isCompleted: false,
        priority: 'Medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (db.select().from(tasks).where as jest.Mock).mockResolvedValue([mockTask]);

      const result = await fetchTask(1);
      expect(result).toEqual(mockTask);
      expect(db.select).toHaveBeenCalled();
    });

    it('should throw an error if the task is not found', async () => {
      (db.select().from(tasks).where as jest.Mock).mockResolvedValue([]);

      await expect(fetchTask(1)).rejects.toThrow('Task not found');
    });
  });

  describe('addTask', () => {
    it('should add a new task', async () => {
      // Ensure all fields are provided, including required ones
      const newTask: NewTask = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date().toISOString(),  // Convert Date to string
        isCompleted: false,
        priority: 'Medium',
        createdAt: new Date().toISOString(),
      };

      // Ensure mockTask has all required fields, including isCompleted and updatedAt
      const mockTask: Task = {
        id: 2,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        isCompleted: false,
        priority: newTask.priority || 'Medium',  // Handle possible undefined value
        createdAt: newTask.createdAt || new Date().toISOString(),  // Handle undefined
        updatedAt: new Date().toISOString() // Required field
      };

      // Mocking the database insert method to return the mockTask
      (db.insert(tasks).values as jest.Mock).mockResolvedValue([mockTask]);

      // Test the addTask function
      const result = await addTask(newTask);
      expect(result).toEqual(mockTask);  // Expect the result to match mockTask
      expect(db.insert).toHaveBeenCalledWith(tasks);
    });
  });


  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updatedTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated task',
        dueDate: new Date().toISOString(),
        priority: 'Low',
        isCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (db.update(tasks).set as jest.Mock).mockResolvedValue([updatedTask]);

      const result = await updateTask(updatedTask);
      expect(result).toEqual(updatedTask);
      expect(db.update).toHaveBeenCalledWith(tasks);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      (db.delete(tasks).where as jest.Mock).mockResolvedValue({});

      await deleteTask(1);
      expect(db.delete).toHaveBeenCalledWith(tasks);
    });
  });

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Test Task 1', description: 'A task', dueDate: new Date().toISOString(), priority: 'High', isCompleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 2, title: 'Test Task 2', description: 'Another task', dueDate: new Date().toISOString(), priority: 'Medium', isCompleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      (db.select().from(tasks).execute as jest.Mock).mockResolvedValue(mockTasks);

      const result = await getTasks();
      expect(result).toEqual(mockTasks);
      expect(db.select).toHaveBeenCalled();
    });
  });
});
