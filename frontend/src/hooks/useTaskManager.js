import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEY, FILTERS, PRIORITIES } from '../constants/config';
import { debounce } from '../utils/helpers';
// Import taskAPI from '../services/api' when backend is ready

// Custom hook centralizing all task logic
// Handles CRUD, filtering, search, persistence with optimistic updates
const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchTerm, setSearchTermInternal] = useState('');
  const [loading, setLoading] = useState(false);

  // Load tasks from localStorage (swap with taskAPI.getAll() later)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    }
  }, []);

  // Debounced search setter
  const debouncedSetSearch = useCallback(
    debounce((term) => setSearchTermInternal(term), DEBOUNCE_DELAY),
    []
  );

  const setSearchTerm = (term) => debouncedSetSearch(term);

  // Save to localStorage (swap with taskAPI calls)
  const saveTasks = useCallback((updatedTasks) => {
    try {
      setTasks(updatedTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, []);

  // Create task (async for loading state and future API)
  const createTask = useCallback(async (newTask) => {
    setLoading(true);
    try {
      const task = {
        id: Date.now().toString(), // Temp ID; use UUID or backend-generated later
        text: newTask.text,
        completed: false,
        priority: newTask.priority || PRIORITIES.MEDIUM,
        category: newTask.category ? newTask.category.trim() : null,
        created_at: new Date().toISOString()
      };
      saveTasks([task, ...tasks]);
    } catch (error) {
      console.error('Failed to create task:', error);
      // Could throw or show error toast
    } finally {
      setLoading(false);
    }
  }, [tasks, saveTasks]);

  // Update task (general for edit/toggle/reorder)
  const updateTask = useCallback((id, updates) => {
    saveTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, [tasks, saveTasks]);

  // Delete task
  const deleteTask = useCallback((id) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  }, [tasks, saveTasks]);

  // Drag-and-drop reorder (optimistic)
  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    // Update order indices if backend expects
    const orderedTasks = newTasks.map((task, index) => ({ ...task, order: index }));
    saveTasks(orderedTasks);
  }, [tasks, saveTasks]);

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