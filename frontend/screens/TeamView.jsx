import React, { useState } from 'react';
import './TeamView.css';
import Avatar from '../components/Avatar';

function TeamView({ users, tasks, currentUser, onChangeRole, onDeleteUser }) {
  const [filter, setFilter] = useState('all');

  const filtered = users.filter(u => {
    if (filter === 'admins') return u.role === 'admin';
    if (filter === 'members') return u.role === 'member';
    return true;
  });

  const roleFilters = [
    { value: 'all',     label: `All (${users.length})` },
    { value: 'admins',  label: `Admins (${users.filter(u => u.role === 'admin').length})` },
    { value: 'members', label: `Members (${users.filter(u => u.role === 'member').length})` },
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h2>Team</h2>
          <p className="page-subtitle">Collaboration, roles, and velocity at a glance.</p>
        </div>
        <div className="chip-group">
          {roleFilters.map(rf => (
            <button key={rf.value} className={`chip-btn ${filter === rf.value ? 'active' : ''}`} onClick={() => setFilter(rf.value)}>
              {rf.label}
            </button>
          ))}
        </div>
      </header>

      <div className="team-grid">
        {filtered.map(u => {
          const assigned = tasks.filter(t => t.assignedTo === u.id).length;
          const done = tasks.filter(t => t.assignedTo === u.id && t.status === 'done').length;
          const pct = assigned ? Math.round((done / assigned) * 100) : 0;
          const isMe = u.id === currentUser.id;
          const isAdmin = currentUser.role === 'admin';

          return (
            <article key={u.id} className="team-card">
              <div className="team-top">
                <Avatar user={u} size={44} />
                <div className="team-info">
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
                <span className={`role-pill ${u.role === 'admin' ? 'role-admin' : ''}`}>{u.role}</span>
              </div>

              <div className="team-metrics">
                <div>
                  <span>Assigned</span>
                  <strong>{assigned}</strong>
                </div>
                <div>
                  <span>Completed</span>
                  <strong>{done}</strong>
                </div>
                <div>
                  <span>Productivity</span>
                  <strong>{pct}%</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div className="member-progress">
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {isAdmin && !isMe && (
                <div className="team-actions">
                  <select
                    value={u.role}
                    onChange={e => onChangeRole(u.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    className="remove-member-btn"
                    onClick={() => onDeleteUser(u.id)}
                    title="Remove member"
                    aria-label="Remove member"
                  >
                    <i className="ti ti-user-minus" aria-hidden="true" />
                  </button>
                </div>
              )}
              {isMe && <div className="role-readonly">You · Role locked</div>}
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-team">
            <i className="ti ti-users-minus" />
            <p>No members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamView;