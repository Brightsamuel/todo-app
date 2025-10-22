import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskStats from '../../components/TaskStats';

describe('TaskStats', () => {
  const mockStats = {
    total: 5,
    active: 3,
    completed: 2,
    highPriority: 1
  };

  it('should render all stats correctly', () => {
    render(<TaskStats stats={mockStats} />);

    expect(screen.getByText('Total: 5')).toBeInTheDocument();
    expect(screen.getByText('Active: 3')).toBeInTheDocument();
    expect(screen.getByText('Completed: 2')).toBeInTheDocument();
    expect(screen.getByText('High Priority: 1')).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(<TaskStats stats={mockStats} />);

    const statsDiv = screen.getByRole('status');
    expect(statsDiv).toHaveAttribute('aria-live', 'polite');
  });
});