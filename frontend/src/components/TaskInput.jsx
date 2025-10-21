import React, { useState } from 'react';
import { PRIORITIES } from '../constants/config';

const TaskInput = ({ onAddTask, disabled }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // '' for none

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    await onAddTask({
      text: text.trim(),
      priority,
      category: category.trim() || null
    });

    // Reset form
    setText('');
    setCategory('');
    setPriority(PRIORITIES.MEDIUM);
  };

  return (
    <form onSubmit={handleSubmit} className="task-input-form">
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          disabled={disabled}
          className="task-text-input"
          maxLength={500}
          aria-label="Task text"
          required
        />
        
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
          disabled={disabled}
          className="category-input"
          maxLength={50}
          aria-label="Task category"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={disabled}
          className="priority-select"
          aria-label="Priority"
        >
          <option value={PRIORITIES.LOW}>Low Priority</option>
          <option value={PRIORITIES.MEDIUM}>Medium Priority</option>
          <option value={PRIORITIES.HIGH}>High Priority</option>
        </select>

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="add-button"
          aria-label="Add task"
        >
          {disabled ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskInput;