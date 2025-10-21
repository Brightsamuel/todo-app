// test/components/TaskList.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../../components/TaskList';

// Properly mock @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }) => {
    const provided = {
      droppableProps: {},
      innerRef: jest.fn(),
      placeholder: null
    };
    const snapshot = {
      isDraggingOver: false
    };
    return <div data-testid="droppable">{children(provided, snapshot)}</div>;
  },
  Draggable: ({ children, draggableId, index }) => {
    const provided = {
      draggableProps: { 'data-testid': draggableId },
      dragHandleProps: {},
      innerRef: jest.fn()
    };
    const snapshot = {
      isDragging: false
    };
    return <div>{children(provided, snapshot)}</div>;
  }
}));

describe('TaskList', () => {
  const mockTasks = [
    { id: 1, text: 'Task 1', completed: false, priority: 'medium' },
    { id: 2, text: 'Task 2', completed: true, priority: 'high' }
  ];

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnDragEnd = jest.fn();

  it('should render tasks count and list', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(screen.getByText('Tasks (2)')).toBeInTheDocument();
    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  });

  it('should render empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(screen.getByText('Tasks (0)')).toBeInTheDocument();
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it('should render with DragDropContext', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    expect(screen.getByTestId('droppable')).toBeInTheDocument();
  });

  it('should display correct task count', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(screen.getByText('Tasks (2)')).toBeInTheDocument();
  });

  it('should render task items with proper props', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onDragEnd={mockOnDragEnd}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});