import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock useTaskManager hook - define mock return value inside the factory
jest.mock('../hooks/useTaskManager', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    tasks: [],
    filteredTasks: [],
    loading: false,
    error: null,
    filter: 'all',
    searchTerm: '',
    stats: { total: 0, completed: 0, active: 0 },
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    onDragEnd: jest.fn(),
    setFilter: jest.fn(),
    setSearchTerm: jest.fn(),
    loadTasks: jest.fn(),
  })),
}));

describe('App Component', () => {
  it('should render app title', () => {
    render(<App />);
    expect(screen.getByText(/todo app/i)).toBeInTheDocument();
  });

  it('should render main sections', () => {
    render(<App />);

    // Check for TaskInput
    expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();

    // Check for FilterButtons
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();

    // Check for TaskList
    expect(screen.getByText(/tasks \(/i)).toBeInTheDocument();
  });

  it('should render TaskStats', () => {
    render(<App />);
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it('should render SearchBar', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    const useTaskManager = require('../hooks/useTaskManager').default;
    useTaskManager.mockReturnValue({
      tasks: [],
      filteredTasks: [],
      loading: true,
      error: null,
      filter: 'all',
      searchTerm: '',
      stats: { total: 0, completed: 0, active: 0 },
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      onDragEnd: jest.fn(),
      setFilter: jest.fn(),
      setSearchTerm: jest.fn(),
      loadTasks: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    const useTaskManager = require('../hooks/useTaskManager').default;
    useTaskManager.mockReturnValue({
      tasks: [],
      filteredTasks: [],
      loading: false,
      error: 'Failed to load tasks',
      filter: 'all',
      searchTerm: '',
      stats: { total: 0, completed: 0, active: 0 },
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      onDragEnd: jest.fn(),
      setFilter: jest.fn(),
      setSearchTerm: jest.fn(),
      loadTasks: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
  });
});