import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdate, onDelete, onDragEnd }) => {
  return (
    <section className="task-list" role="list">
      <h2>Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>No tasks found. Add one above!</p>
      ) : (
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={snapshot.isDraggingOver ? 'dragging-over' : ''}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <TaskItem
                      task={task}
                      provided={dragProvided}
                      isDragging={dragSnapshot.isDragging}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}
    </section>
  );
};

export default TaskList;