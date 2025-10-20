import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks"
      />
      {searchTerm && (
        <button onClick={() => onSearchChange('')} aria-label="Clear search">Clear</button>
      )}
    </div>
  );
};

export default SearchBar;