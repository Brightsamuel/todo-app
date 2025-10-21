import React, { useState } from 'react';
import { formatDate, getPriorityClass } from '../utils/helpers';

const TaskItem = ({ task, onUpdate, onDelete, provided, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onUpdate(task.id, { text: trimmed });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      role="listitem"
      aria-label={`Task: ${task.text}`}
    >
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="task-checkbox"
          aria-label="Toggle completion"
        />

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            className="task-edit-input"
            autoFocus
            maxLength={500}
          />
        ) : (
          <div className="task-details">
            <span className={`task-text ${task.completed ? 'line-through' : ''}`}>
              {task.text}
            </span>
            
            <div className="task-meta">
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority?.toUpperCase()}
              </span>
              
              {task.category && (
                <span className="category-badge">
                  {task.category}
                </span>
              )}
              
              <span className="task-date">
                {formatDate(task.created_at)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="task-actions">
        {!isEditing && !task.completed && (
          <button
            onClick={() => setIsEditing(true)}
            className="action-button edit-button"
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
        )}
        
        <button
          onClick={() => onDelete(task.id)}
          className="action-button delete-button"
          title="Delete task"
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;