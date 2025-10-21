// test/hooks/useTaskManager.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import useTaskManager from '../../hooks/useTaskManager';
import { taskAPI } from '../../services/api';
import { FILTERS } from '../../constants/config';

jest.mock('../../services/api');

describe('useTaskManager Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskAPI.getTasks.mockResolvedValue([]);
  });

  it('should initialize with empty tasks and default filter', async () => {
    const { result } = renderHook(() => useTaskManager());
    
    expect(result.current.filter).toBe(FILTERS.ALL);
    expect(result.current.searchTerm).toBe('');
    
    // Wait for loading to complete
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.tasks).toEqual([]);
  });

  it('should load tasks from API on mount', async () => {
    const mockTasks = [
      { id: 1, text: 'Test Task', completed: false, priority: 'medium' }
    ];
    taskAPI.getTasks.mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });

    expect(taskAPI.getTasks).toHaveBeenCalledTimes(1);
  });

  it('should create a new task', async () => {
    const newTask = { id: 2, text: 'New Task', completed: false, priority: 'high' };
    taskAPI.createTask.mockResolvedValue(newTask);
    taskAPI.getTasks.mockResolvedValue([]);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createTask('New Task', 'high');
    });

    await waitFor(() => {
      expect(result.current.tasks).toContainEqual(newTask);
    });

    expect(taskAPI.createTask).toHaveBeenCalledWith('New Task', 'high');
  });

  it('should update task and replace in state', async () => {
    const initialTask = { id: 1, text: 'Original', completed: false, priority: 'medium' };
    const updatedTask = { id: 1, text: 'Updated', completed: false, priority: 'medium' };
    
    taskAPI.getTasks.mockResolvedValue([initialTask]);
    taskAPI.updateTask.mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(1));

    await act(async () => {
      await result.current.updateTask(1, { text: 'Updated' });
    });

    await waitFor(() => {
      expect(result.current.tasks[0].text).toBe('Updated');
    });

    expect(taskAPI.updateTask).toHaveBeenCalledWith(1, { text: 'Updated' });
  });

  it('should delete task and remove from state', async () => {
    const task = { id: 1, text: 'To Delete', completed: false, priority: 'medium' };
    
    taskAPI.getTasks.mockResolvedValue([task]);
    taskAPI.deleteTask.mockResolvedValue();

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(1));

    await act(async () => {
      await result.current.deleteTask(1);
    });

    await waitFor(() => {
      expect(result.current.tasks).toEqual([]);
    });

    expect(taskAPI.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should reorder tasks on drag end', async () => {
    const tasks = [
      { id: 1, text: 'Task 1', completed: false, priority: 'medium' },
      { id: 2, text: 'Task 2', completed: false, priority: 'high' }
    ];
    
    taskAPI.getTasks.mockResolvedValue(tasks);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(2));

    const mockResult = {
      destination: { index: 1 },
      source: { index: 0 },
    };

    act(() => {
      result.current.onDragEnd(mockResult);
    });

    expect(result.current.tasks[0].id).toBe(2);
    expect(result.current.tasks[1].id).toBe(1);
  });

  it('should filter tasks by status', async () => {
    const tasks = [
      { id: 1, text: 'Task 1', completed: false, priority: 'medium' },
      { id: 2, text: 'Task 2', completed: true, priority: 'high' }
    ];
    
    taskAPI.getTasks.mockResolvedValue(tasks);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(2));

    act(() => {
      result.current.setFilter(FILTERS.COMPLETED);
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].completed).toBe(true);
  });

  it('should filter tasks by search term', async () => {
    const tasks = [
      { id: 1, text: 'This should match', completed: false, priority: 'medium' },
      { id: 2, text: 'No hit here', completed: false, priority: 'high' }
    ];
    
    taskAPI.getTasks.mockResolvedValue(tasks);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(2));

    act(() => {
      result.current.setSearchTerm('match');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].text).toBe('This should match');
  });

  it('should compute stats correctly', async () => {
    const tasks = [
      { id: 1, text: 'Task 1', completed: false, priority: 'medium' },
      { id: 2, text: 'Task 2', completed: true, priority: 'high' }
    ];
    
    taskAPI.getTasks.mockResolvedValue(tasks);

    const { result } = renderHook(() => useTaskManager());

    await waitFor(() => expect(result.current.tasks.length).toBe(2));

    expect(result.current.stats).toEqual({
      total: 2,
      completed: 1,
      active: 1,
    });
  });
});