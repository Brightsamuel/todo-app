import React from 'react';
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

  return (
    <div className="app">
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