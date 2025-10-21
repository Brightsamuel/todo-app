// test/components/TaskItem.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../../components/TaskItem';
import { PRIORITY_LEVELS } from '../../constants/config';

// Mock the drag and drop components
jest.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children, draggableId, index }) =>
    children({
      draggableProps: { 'data-testid': draggableId },
      dragHandleProps: { 'data-drag-handle': true },
      innerRef: jest.fn(),
    }, {}),
}));

const mockOnUpdate = jest.fn();
const mockOnDelete = jest.fn();

jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  formatDate: jest.fn(() => 'Jan 1, 2024'),
}));

describe('TaskItem', () => {
  const defaultTask = {
    id: 1,
    text: 'Test Task',
    completed: false,
    priority: PRIORITY_LEVELS.MEDIUM,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render task with text and priority', () => {
    render(
      <TaskItem
        task={defaultTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should toggle completed status on checkbox click', async () => {
    render(
      <TaskItem
        task={defaultTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, { completed: true });
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(
      <TaskItem
        task={defaultTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should apply completed styling when task is completed', () => {
    const completedTask = { ...defaultTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should display high priority indicator', () => {
    const highPriorityTask = { ...defaultTask, priority: PRIORITY_LEVELS.HIGH };

    render(
      <TaskItem
        task={highPriorityTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should display low priority indicator', () => {
    const lowPriorityTask = { ...defaultTask, priority: PRIORITY_LEVELS.LOW };

    render(
      <TaskItem
        task={lowPriorityTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('should show formatted creation date', () => {
    render(
      <TaskItem
        task={defaultTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should have drag handle', () => {
    const { container } = render(
      <TaskItem
        task={defaultTask}
        index={0}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const dragHandle = container.querySelector('[data-drag-handle]');
    expect(dragHandle).toBeInTheDocument();
  });
});