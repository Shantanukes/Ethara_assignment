import React from 'react';
import './DashboardView.css';
import { isOverdue } from '../constants';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';

function DashboardView({ tasks, projects, users, currentUser, onNewTask, onViewProject, onToggleSidebar }) {
  const viewableTasks = currentUser.role === "admin" ? tasks : tasks.filter(t => t.assignedTo === currentUser.id);
  const inProg = viewableTasks.filter(t => t.status === "in-progress").length;
  const done = viewableTasks.filter(t => t.status === "done").length;
  const overdue = viewableTasks.filter(isOverdue).length;
  const todo = viewableTasks.filter(t => t.status === "todo").length;
  const recent = [...viewableTasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const timeline = [...viewableTasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const topProjects = projects.slice(0, 4);
  const teamUsers = users.slice(0, 6);
  const firstName = currentUser.name.split(" ")[0];
  const initials = currentUser.initials || currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  const stats = [
    { label: "Total tasks", value: viewableTasks.length, icon: "ti-list-check", tone: "blue" },
    { label: "In progress", value: inProg, icon: "ti-loader", tone: "amber" },
    { label: "Completed", value: done, icon: "ti-circle-check", tone: "green" },
    { label: "Overdue", value: overdue, icon: "ti-alert-circle", tone: "red" },
  ];

  const kanbanTodo = viewableTasks.filter(t => t.status === "todo").slice(0, 3);
  const kanbanProgress = viewableTasks.filter(t => t.status === "in-progress").slice(0, 3);
  const kanbanDone = viewableTasks.filter(t => t.status === "done").slice(0, 3);

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <button className="icon-btn mobile-only" onClick={onToggleSidebar} aria-label="Open menu">
          <i className="ti ti-menu-2" aria-hidden="true" />
        </button>
        <div className="topbar-title">
          <h2>Dashboard</h2>
          <p>Welcome back, {firstName}</p>
        </div>
        <div className="topbar-actions">
          <div className="search-field">
            <i className="ti ti-search" aria-hidden="true" />
            <input type="search" placeholder="Search tasks, projects, teams" aria-label="Search" />
          </div>
          <button className="icon-btn" aria-label="Notifications">
            <i className="ti ti-bell" aria-hidden="true" />
            <span className="status-dot" />
          </button>
          <button className="icon-btn" aria-label="Toggle theme">
            <i className="ti ti-sun-high" aria-hidden="true" />
          </button>
          <button className="profile-chip" aria-label="User menu">
            <span className="profile-initials">{initials}</span>
            <span>{firstName}</span>
            <i className="ti ti-chevron-down" aria-hidden="true" />
          </button>
          <button className="primary-btn" onClick={onNewTask}>
            <i className="ti ti-plus" aria-hidden="true" /> New task
          </button>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map(s => (
          <article key={s.label} className={`stat-card tone-${s.tone}`}>
            <div>
              <p>{s.label}</p>
              <h3>{s.value}</h3>
            </div>
            <div className="stat-icon">
              <i className={`ti ${s.icon}`} aria-hidden="true" />
            </div>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="card analytics-card">
          <div className="card-header">
            <h4>Productivity</h4>
            <span className="chip">+12% this week</span>
          </div>
          <svg className="line-chart" viewBox="0 0 220 80" role="img" aria-label="Productivity chart">
            <path className="line-fill" d="M5 60 L35 52 L70 40 L110 46 L145 30 L180 36 L215 24 L215 70 L5 70 Z" />
            <path className="line-stroke" d="M5 60 L35 52 L70 40 L110 46 L145 30 L180 36 L215 24" />
          </svg>
          <div className="chart-meta">
            <div>
              <p>Focus time</p>
              <strong>32h</strong>
            </div>
            <div>
              <p>Output</p>
              <strong>84%</strong>
            </div>
          </div>
        </article>

        <article className="card analytics-card">
          <div className="card-header">
            <h4>Weekly completion</h4>
            <span className="chip">{done}/{viewableTasks.length} done</span>
          </div>
          <div className="bar-chart" role="img" aria-label="Weekly completion chart">
            {[42, 56, 36, 68, 58, 74, 62].map((v, i) => (
              <div key={i} className="bar-col">
                <span style={{ height: `${v}%` }} />
              </div>
            ))}
          </div>
          <p className="chart-caption">Best streak: 4 days · Today {todo} tasks queued</p>
        </article>

        <article className="card analytics-card">
          <div className="card-header">
            <h4>Team performance</h4>
            <span className="chip">Active now</span>
          </div>
          <div className="radial-wrap">
            <div className="radial" style={{ "--value": "78%" }}>
              <div>
                <span>78%</span>
                <small>Health score</small>
              </div>
            </div>
            <div className="radial-list">
              <div>
                <p>Velocity</p>
                <strong>1.8x</strong>
              </div>
              <div>
                <p>Cycle time</p>
                <strong>2.1d</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card tasks-card">
          <div className="card-header">
            <h4>Recent tasks</h4>
            <button className="ghost-btn">View all</button>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">No tasks yet. Create your first task.</div>
          ) : (
            <div className="task-list">
              {recent.map(t => (
                <div key={t.id} className="task-row">
                  <div>
                    <p>{t.title}</p>
                    <span>{isOverdue(t) ? "Overdue" : "Due"} · {t.dueDate}</span>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card project-card">
          <div className="card-header">
            <h4>Project progress</h4>
            <span className="chip">Live</span>
          </div>
          <div className="project-list">
            {topProjects.map(p => {
              const projectTasks = tasks.filter(t => t.projectId === p.id);
              const projectDone = projectTasks.filter(t => t.status === "done").length;
              const pct = projectTasks.length ? Math.round((projectDone / projectTasks.length) * 100) : 0;
              return (
                <button key={p.id} className="project-row" onClick={() => onViewProject(p.id)}>
                  <div className="project-meta">
                    <strong>{p.name}</strong>
                    <span>{projectDone}/{projectTasks.length} done</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </article>

        <article className="card kanban-card">
          <div className="card-header">
            <h4>Kanban preview</h4>
            <span className="chip">Sprint 12</span>
          </div>
          <div className="kanban">
            <div className="kanban-col">
              <div className="kanban-head">To do</div>
              {kanbanTodo.map(t => (
                <div key={t.id} className="kanban-task">{t.title}</div>
              ))}
            </div>
            <div className="kanban-col">
              <div className="kanban-head">In progress</div>
              {kanbanProgress.map(t => (
                <div key={t.id} className="kanban-task">{t.title}</div>
              ))}
            </div>
            <div className="kanban-col">
              <div className="kanban-head">Done</div>
              {kanbanDone.map(t => (
                <div key={t.id} className="kanban-task">{t.title}</div>
              ))}
            </div>
          </div>
        </article>

        <article className="card team-card">
          <div className="card-header">
            <h4>Team collaboration</h4>
            <span className="chip">{teamUsers.length} active</span>
          </div>
          <div className="team-avatars">
            {teamUsers.map(user => (
              <Avatar key={user.id} user={user} size={36} />
            ))}
            <button className="ghost-btn">Invite</button>
          </div>
          <div className="team-metrics">
            <div>
              <p>Live editors</p>
              <strong>4</strong>
            </div>
            <div>
              <p>Comments</p>
              <strong>12</strong>
            </div>
            <div>
              <p>Avg response</p>
              <strong>8m</strong>
            </div>
          </div>
        </article>

        <article className="card activity-card">
          <div className="card-header">
            <h4>Activity timeline</h4>
            <span className="chip">Real-time</span>
          </div>
          {timeline.length === 0 ? (
            <div className="skeleton-stack">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          ) : (
            <div className="timeline">
              {timeline.map(t => (
                <div key={t.id} className="timeline-item">
                  <span className="timeline-dot" />
                  <div>
                    <p>{t.title}</p>
                    <span>{t.status.replace("-", " ")} · {t.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <button className="floating-new-task" onClick={onNewTask} aria-label="Create new task">
        <i className="ti ti-plus" aria-hidden="true" />
        <span>New task</span>
      </button>
    </div>
  );
}

export default DashboardView;