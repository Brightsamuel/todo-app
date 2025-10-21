import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import FilterButtons from './components/FilterButtons';
import SearchBar from './components/SearchBar';
import TaskStats from './components/TaskStats';
import useTaskManager from './hooks/useTaskManager';
import './App.css';

function App() {
  const {
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
  } = useTaskManager();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="app">
      {/* Dark Mode Toggle */}
      <div className="theme-toggle">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <header className="app-header">
        <h1>Todo App</h1>
        <p>Manage your tasks efficiently with priorities and categories.</p>
      </header>
      
      <main className="app-main">
        <TaskInput onAddTask={createTask} disabled={loading} />
        
        <div className="controls">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <FilterButtons filter={filter} onFilterChange={setFilter} />
        </div>
        
        <TaskStats stats={stats} />
        
        <DragDropContext onDragEnd={onDragEnd}>
          <TaskList
            tasks={filteredTasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onDragEnd={onDragEnd}
          />
        </DragDropContext>    
      </main>
    </div>
  );
}

export default App;