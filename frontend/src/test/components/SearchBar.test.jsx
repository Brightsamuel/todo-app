import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
  });

  it('should render input with placeholder', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    expect(screen.getByLabelText('Search tasks')).toBeInTheDocument();
  });

  it('should update search term on input change', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(input, { target: { value: 'test search' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('test search');
  });

  it('should show clear button when searchTerm is present', () => {
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('should hide clear button when searchTerm is empty', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('should clear search on clear button click', () => {
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);

    fireEvent.click(screen.getByLabelText('Clear search'));

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });
});