import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterButtons from '../../components/FilterButtons';
import { FILTERS } from '../../constants/config';

describe('FilterButtons', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should render all filter buttons', () => {
    render(<FilterButtons filter={FILTERS.ALL} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });

  it('should apply active class to current filter', () => {
    render(<FilterButtons filter={FILTERS.ACTIVE} onFilterChange={mockOnFilterChange} />);

    const activeButton = screen.getByRole('button', { name: 'Active' });
    expect(activeButton).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('active');
  });

  it('should call onFilterChange when button clicked', () => {
    render(<FilterButtons filter={FILTERS.ALL} onFilterChange={mockOnFilterChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith(FILTERS.COMPLETED);
  });

  it('should set aria-pressed true for active button', () => {
    render(<FilterButtons filter={FILTERS.COMPLETED} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });
});