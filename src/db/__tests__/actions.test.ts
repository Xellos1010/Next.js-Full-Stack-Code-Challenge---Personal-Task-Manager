import { addTask, deleteTask, fetchTask, getTasks, updateTask } from '../actions';
import { NewTask, Task, tasks } from '../schema';

// Mock the database methods
const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({ where: mockWhere }));
const mockWhere = jest.fn(() => ({ execute: jest.fn() }));

const mockInsert = jest.fn();
const mockValues = jest.fn(() => ({ returning: mockReturning }));
const mockReturning = jest.fn(() => ({ execute: jest.fn() }));

const mockUpdate = jest.fn();
const mockSet = jest.fn(() => ({ where: mockWhereUpdate }));
const mockWhereUpdate = jest.fn(() => ({ returning: mockReturning }));

const mockDelete = jest.fn();
const mockWhereDelete = jest.fn(() => ({ execute: jest.fn() }));

jest.mock('../client', () => ({
  db: {
    select: () => ({ from: mockFrom }),
    insert: () => ({ values: mockValues }),
    update: () => ({ set: mockSet }),
    delete: () => ({ where: mockWhereDelete }),
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
        dueDate: new Date().toISOString(),
        isCompleted: false,
        priority: 'Medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockWhere.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue([mockTask]),
      });

      const result = await fetchTask(1);
      expect(result).toEqual(mockTask);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(tasks);
      expect(mockWhere).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw an error if the task is not found', async () => {
      mockWhere.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue([]),
      });

      await expect(fetchTask(1)).rejects.toThrow('Task not found');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(tasks);
      expect(mockWhere).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('addTask', () => {
    it('should add a new task', async () => {
      const newTask: NewTask = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date().toISOString(),
        isCompleted: false,
        priority: 'Medium',
        createdAt: new Date().toISOString(),
      };

      const mockTask: Task = {
        id: 2,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        isCompleted: false,
        priority: newTask.priority || 'Medium',
        createdAt: newTask.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockReturning.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue([mockTask]),
      });

      const result = await addTask(newTask);
      expect(result).toEqual(mockTask);
      expect(mockInsert).toHaveBeenCalledWith(tasks);
      expect(mockValues).toHaveBeenCalledWith(newTask);
      expect(mockReturning).toHaveBeenCalled();
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

      mockReturning.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue([updatedTask]),
      });

      const result = await updateTask(updatedTask);
      expect(result).toEqual(updatedTask);
      expect(mockUpdate).toHaveBeenCalledWith(tasks);
      expect(mockSet).toHaveBeenCalledWith(updatedTask);
      expect(mockWhereUpdate).toHaveBeenCalledWith(expect.anything());
      expect(mockReturning).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      mockWhereDelete.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue({}),
      });

      await deleteTask(1);
      expect(mockDelete).toHaveBeenCalledWith(tasks);
      expect(mockWhereDelete).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'A task',
          dueDate: new Date().toISOString(),
          priority: 'High',
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Another task',
          dueDate: new Date().toISOString(),
          priority: 'Medium',
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockWhere.mockReturnValueOnce({
        execute: jest.fn().mockResolvedValue(mockTasks),
      });

      const result = await getTasks();
      expect(result).toEqual(mockTasks);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(tasks);
      expect(mockWhere).toHaveBeenCalledWith(expect.anything());
    });
  });
});
