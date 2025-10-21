// Mock axios before importing anything else
jest.mock('axios');

import axios from 'axios';
import { taskAPI } from '../../services/api';

describe('Task API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ];
      
      axios.get.mockResolvedValue({ data: mockTasks });

      const result = await taskAPI.getTasks();

      expect(result).toEqual(mockTasks);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/tasks')
      );
    });

    it('should handle errors when fetching tasks', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(taskAPI.getTasks()).rejects.toThrow('Network error');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTask = { id: 3, text: 'New Task', completed: false, priority: 'medium' };
      
      axios.post.mockResolvedValue({ data: newTask });

      const result = await taskAPI.createTask('New Task', 'medium');

      expect(result).toEqual(newTask);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/tasks'),
        { text: 'New Task', priority: 'medium' }
      );
    });

    it('should handle errors when creating task', async () => {
      axios.post.mockRejectedValue(new Error('Create failed'));

      await expect(taskAPI.createTask('Task', 'medium')).rejects.toThrow('Create failed');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updatedTask = { id: 1, text: 'Updated Task', completed: true, priority: 'high' };
      
      axios.put.mockResolvedValue({ data: updatedTask });

      const result = await taskAPI.updateTask(1, { completed: true });

      expect(result).toEqual(updatedTask);
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1'),
        { completed: true }
      );
    });

    it('should handle errors when updating task', async () => {
      axios.put.mockRejectedValue(new Error('Update failed'));

      await expect(taskAPI.updateTask(1, {})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      axios.delete.mockResolvedValue({ data: { success: true } });

      await taskAPI.deleteTask(1);

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1')
      );
    });

    it('should handle errors when deleting task', async () => {
      axios.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(taskAPI.deleteTask(1)).rejects.toThrow('Delete failed');
    });
  });
});