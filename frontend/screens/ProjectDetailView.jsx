import React, { useState } from 'react';
import './ProjectDetailView.css';
import Btn from '../components/FormElements/Btn';
import TaskRow from '../components/Task/TaskRow';
import TaskTableHeader from '../components/Task/TaskTableHeader';

function ProjectDetailView({ project, tasks, users, currentUser, onNewTask, onEditTask, onDeleteTask, onStatusChange, onBack }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const pt = tasks.filter(t => t.projectId === project.id);
  const filtered = pt.filter(t =>
    (filter === "all" || t.status === filter) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    all: pt.length,
    todo: pt.filter(t => t.status === "todo").length,
    "in-progress": pt.filter(t => t.status === "in-progress").length,
    done: pt.filter(t => t.status === "done").length,
  };

  const canManage = currentUser.role === "admin";
  const isMember = project.members.includes(currentUser.id);

  return (
    <div className="page-shell">
      <button className="back-link" onClick={onBack}>
        <i className="ti ti-arrow-left" aria-hidden="true" /> Back to projects
      </button>

      <div className="project-hero">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description || "No description provided."}</p>
        </div>
        {(canManage || isMember) && (
          <Btn variant="primary" onClick={onNewTask}>
            <i className="ti ti-plus" aria-hidden="true" /> Add task
          </Btn>
        )}
      </div>

      <div className="project-filters">
        {[["all", "All"], ["todo", "To Do"], ["in-progress", "In Progress"], ["done", "Done"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`chip-btn ${filter === v ? "active" : ""}`}>
            {l} ({counts[v]})
          </button>
        ))}
        <div className="search-field">
          <i className="ti ti-search" aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks" />
        </div>
      </div>

      <div className="table-card">
        <TaskTableHeader showActions={canManage} />
        {filtered.length === 0 ? (
          <p className="empty-text">No tasks found</p>
        ) : (
          filtered.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              users={users}
              projects={[project]}
              canEdit={canManage || t.assignedTo === currentUser.id}
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

export default ProjectDetailView;