import React from 'react';
import './MyTasksView.css';
import Btn from '../components/FormElements/Btn';
import TaskRow from '../components/Task/TaskRow';
import TaskTableHeader from '../components/Task/TaskTableHeader';

function MyTasksView({ tasks, projects, users, currentUser, onNewTask, onEditTask, onDeleteTask, onStatusChange }) {
  const mine = tasks.filter(t => t.assignedTo === currentUser.id);
  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h2>My Tasks</h2>
          <p className="page-subtitle">Personal queue with priority and status control.</p>
        </div>
        <Btn variant="primary" onClick={onNewTask}>
          <i className="ti ti-plus" aria-hidden="true" /> New task
        </Btn>
      </header>

      <div className="tasks-toolbar">
        <div className="search-field">
          <i className="ti ti-search" aria-hidden="true" />
          <input type="search" placeholder="Search tasks" aria-label="Search tasks" />
        </div>
        <div className="chip-group">
          <button className="chip-btn active">All</button>
          <button className="chip-btn">To do</button>
          <button className="chip-btn">In progress</button>
          <button className="chip-btn">Done</button>
        </div>
      </div>

      <div className="table-card">
        <TaskTableHeader showActions />
        {mine.length === 0 ? (
          <p className="empty-text">No tasks assigned to you</p>
        ) : (
          mine.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              users={users}
              projects={projects}
              canEdit
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MyTasksView;