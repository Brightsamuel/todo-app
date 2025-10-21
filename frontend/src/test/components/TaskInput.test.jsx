// test/components/TaskInput.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskInput from '../../components/TaskInput';
import { PRIORITY_LEVELS } from '../../constants/config';

describe('TaskInput', () => {
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  it('should render input and button', () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('should add task on form submit', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText(/add a new task/i);
    
    await userEvent.type(input, 'New Task');
    
    const button = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(button);
    
    expect(mockOnAddTask).toHaveBeenCalledWith('New Task', 'medium');
    expect(input.value).toBe(''); // Should clear after submit
  });

  it('should not add empty task', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(button);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('should not add task with only whitespace', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText(/add a new task/i);
    await userEvent.type(input, '   ');
    
    const button = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(button);
    
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('should change priority selection', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, PRIORITY_LEVELS.HIGH);
    
    expect(select.value).toBe(PRIORITY_LEVELS.HIGH);
  });

  it('should add task with selected priority', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText(/add a new task/i);
    const select = screen.getByRole('combobox');
    
    await userEvent.selectOptions(select, PRIORITY_LEVELS.HIGH);
    await userEvent.type(input, 'High Priority Task');
    
    const button = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(button);
    
    expect(mockOnAddTask).toHaveBeenCalledWith('High Priority Task', 'high');
  });

  it('should handle Enter key press', async () => {
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText(/add a new task/i);
    await userEvent.type(input, 'Task via Enter{enter}');
    
    expect(mockOnAddTask).toHaveBeenCalledWith('Task via Enter', 'medium');
  });
});