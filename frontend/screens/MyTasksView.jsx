import React, { useState } from 'react';
import './MyTasksView.css';
import Btn from '../components/FormElements/Btn';
import TaskRow from '../components/Task/TaskRow';
import TaskTableHeader from '../components/Task/TaskTableHeader';

function MyTasksView({ tasks, projects, users, currentUser, onNewTask, onEditTask, onDeleteTask, onStatusChange }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Admins see all tasks; members see only their own
  const baseTasks = currentUser.role === 'admin'
    ? tasks
    : tasks.filter(t => t.assignedTo === currentUser.id);

  const filtered = baseTasks.filter(t => {
    const matchesStatus = filter === 'all' || t.status === filter;
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

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
          <input
            type="search"
            placeholder="Search tasks"
            aria-label="Search tasks"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="chip-group">
          {statusFilters.map(sf => (
            <button
              key={sf.value}
              className={`chip-btn ${filter === sf.value ? 'active' : ''}`}
              onClick={() => setFilter(sf.value)}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card">
        <TaskTableHeader showActions />
        {filtered.length === 0 ? (
          <p className="empty-text">
            {search || filter !== 'all' ? 'No tasks match your filters.' : 'No tasks assigned to you.'}
          </p>
        ) : (
          filtered.map(t => (
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