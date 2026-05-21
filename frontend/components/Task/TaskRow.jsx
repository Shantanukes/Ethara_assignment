import React from 'react';
import { isOverdue, STATUS_MAP } from '../../constants';
import Avatar from '../Avatar';
import PriorityDot from '../PriorityDot';
import StatusBadge from '../StatusBadge';
import './TaskTable.css';

function TaskRow({ task, users, projects, canEdit, onEdit, onDelete, onStatusChange }) {
  const assignee = users.find(u => u.id === task.assignedTo);
  const project = projects.find(p => p.id === task.projectId);
  const overdue = isOverdue(task);

  return (
    <div className="task-row">
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {project && <span>{project.name} · </span>}
          {overdue && <span className="task-overdue">Overdue · </span>}
          Due {task.dueDate}
        </div>
      </div>
      <PriorityDot priority={task.priority} />
      {canEdit ? (
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value)}
          className="task-status-select"
          style={{ background: STATUS_MAP[task.status].bg, color: STATUS_MAP[task.status].fg }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      ) : (
        <StatusBadge status={task.status} />
      )}
      {assignee ? <Avatar user={assignee} size={28} /> : <span />}
      {canEdit ? (
        <div className="task-actions">
          <button onClick={() => onEdit(task)} title="Edit" className="task-icon-btn">
            <i className="ti ti-edit" aria-hidden="true" />
          </button>
          <button onClick={() => onDelete(task.id)} title="Delete" className="task-icon-btn danger">
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <span />
      )}
    </div>
  );
}

export default TaskRow;