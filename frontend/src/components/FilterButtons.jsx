import React from 'react';
import { FILTERS } from '../constants/config';

const FilterButtons = ({ filter, onFilterChange }) => {
  return (
    <div className="filter-buttons" role="group" aria-label="Filter tasks">
      {Object.values(FILTERS).map((f) => (
        <button
          key={f}
          className={filter === f ? 'active' : ''}
          onClick={() => onFilterChange(f)}
          aria-pressed={filter === f}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;