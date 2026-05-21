import React from 'react';
import './TaskTable.css';

function TaskTableHeader({ showActions }) {
  return (
    <div className="task-table-header">
      <span>Task</span>
      <span>Priority</span>
      <span>Status</span>
      <span></span>
      <span>{showActions ? "Actions" : ""}</span>
    </div>
  );
}

export default TaskTableHeader;