import React from 'react';
import './ProjectsView.css';
import Btn from '../components/FormElements/Btn';
import Avatar from '../components/Avatar';

function ProjectsView({ projects, tasks, users, currentUser, onNewProject, onViewProject, onDeleteProject }) {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h2>Projects</h2>
          <p className="page-subtitle">Track progress, owners, and delivery status.</p>
        </div>
        {currentUser.role === "admin" && (
          <Btn variant="primary" onClick={onNewProject}>
            <i className="ti ti-plus" aria-hidden="true" /> New project
          </Btn>
        )}
      </header>

      <div className="projects-toolbar">
        <div className="search-field">
          <i className="ti ti-search" aria-hidden="true" />
          <input type="search" placeholder="Search projects" aria-label="Search projects" />
        </div>
        <div className="chip-group">
          <button className="chip-btn active">All</button>
          <button className="chip-btn">Active</button>
          <button className="chip-btn">On hold</button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(p => {
          const pt = tasks.filter(t => t.projectId === p.id);
          const pdone = pt.filter(t => t.status === "done").length;
          const pct = pt.length ? Math.round((pdone / pt.length) * 100) : 0;
          const mems = users.filter(u => p.members.includes(u.id));
          return (
            <article key={p.id} className="project-card" onClick={() => onViewProject(p.id)}>
              <div className="project-head">
                <h3>{p.name}</h3>
                {currentUser.role === "admin" && (
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteProject(p.id); }}
                    className="icon-ghost"
                    title="Delete project"
                    aria-label="Delete project"
                  >
                    <i className="ti ti-trash" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="project-desc">{p.description || "No description provided."}</p>
              <div className="project-progress">
                <div>
                  <span>Progress</span>
                  <strong>{pct}%</strong>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="project-foot">
                <div className="avatar-stack">
                  {mems.slice(0, 4).map((u, i) => (
                    <div key={u.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                      <Avatar user={u} size={28} />
                    </div>
                  ))}
                  {mems.length > 4 && <span className="avatar-more">+{mems.length - 4}</span>}
                </div>
                <span className="project-meta">{pt.length} tasks</span>
              </div>
            </article>
          );
        })}
        {projects.length === 0 && (
          <div className="empty-card">
            <i className="ti ti-folder-x" aria-hidden="true" />
            <p>No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsView;