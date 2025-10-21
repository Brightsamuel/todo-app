import { useState, useEffect, useCallback, useMemo } from 'react';
import { FILTERS, PRIORITIES, DEBOUNCE_DELAY } from '../constants/config';
import { debounce } from '../utils/helpers';
import { taskAPI } from '../services/api';

// Custom hook centralizing all task logic (API-driven, graceful localStorage fallback for load)
const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchTerm, setSearchTermInternal] = useState('');
  const [loading, setLoading] = useState(false);

  // Load tasks from API on mount, fallback to localStorage if API fails
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const { data } = await taskAPI.getAll();
        setTasks(data || []);
      } catch (error) {
        console.error('Failed to load tasks from API:', error);
        // Fallback to localStorage if API down
        try {
          const saved = localStorage.getItem('todo-tasks');
          if (saved) setTasks(JSON.parse(saved));
        } catch (fallbackError) {
          console.error('Fallback load failed:', fallbackError);
          setTasks([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Debounced search setter
  const debouncedSetSearch = useCallback(
    debounce((term) => setSearchTermInternal(term), DEBOUNCE_DELAY),
    []
  );

  const setSearchTerm = useCallback((term) => {
    if (!term) setSearchTermInternal('');
    debouncedSetSearch(term);
  }, [debouncedSetSearch]);

  // Create task (async API call)
  const createTask = useCallback(async (newTask) => {
    setLoading(true);
    try {
      const { data } = await taskAPI.create(newTask);
      console.log('Created task:', data);
      setTasks(prev => {
        const updated = [data, ...prev];
        console.log('New tasks state:', updated);
        return updated;
      }); // Optimistic add
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update task (async API call)
  const updateTask = useCallback(async (id, updates) => {
    try {
      const { data } = await taskAPI.update(id, updates);
      console.log('Updated task:', data);
      setTasks(prev => {
        const updated = prev.map(task => task.id === id ? data : task);
        console.log('State after update:', updated);
        return updated;
      }); // Optimistic update
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, []);

  // Delete task (async API call)
  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.delete(id);
      console.log('Deleted task id:', id);
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        console.log('State after delete:', updated);
        return updated;
      }); // Optimistic delete
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, []);

  // Drag-and-drop reorder (async API call with ID array)
  const onDragEnd = useCallback(async (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(tasks);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    const orderIds = newOrder.map(task => task.id); // Send ID array

    try {
      await taskAPI.reorder(orderIds);
      console.log('Reordered IDs sent:', orderIds);
      console.log('State after reorder:', newOrder);
      setTasks(newOrder); // Optimistic reorder
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
    }
  }, [tasks]);

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filter !== FILTERS.ALL) {
      filtered = filtered.filter((task) =>
        filter === FILTERS.ACTIVE ? !task.completed : task.completed
      );
    }

    // Search by text (case-insensitive)
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, filter, searchTerm]);

  // Stats computation
  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    highPriority: tasks.filter((t) => t.priority === PRIORITIES.HIGH).length
  }), [tasks]);

  return {
    tasks,
    filteredTasks,
    filter,
    searchTerm,
    createTask,
    updateTask,
    deleteTask,
    setFilter,
    setSearchTerm,
    onDragEnd,
    stats,
    loading
  };
};

export default useTaskManager;