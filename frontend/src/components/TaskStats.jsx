import React from 'react';

const TaskStats = ({ stats }) => {
  return (
    <div className="task-stats" role="status" aria-live="polite">
      <div>Total: {stats.total}</div>
      <div>Active: {stats.active}</div>
      <div>Completed: {stats.completed}</div>
      <div>High Priority: {stats.highPriority}</div>
    </div>
  );
};

export default TaskStats;