import React from 'react';
import './TeamView.css';
import Avatar from '../components/Avatar';

function TeamView({ users, tasks, currentUser, onChangeRole }) {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h2>Team</h2>
          <p className="page-subtitle">Collaboration, roles, and velocity at a glance.</p>
        </div>
        <div className="chip-group">
          <button className="chip-btn active">All</button>
          <button className="chip-btn">Online</button>
          <button className="chip-btn">Admins</button>
        </div>
      </header>

      <div className="team-grid">
        {users.map(u => {
          const assigned = tasks.filter(t => t.assignedTo === u.id).length;
          const done = tasks.filter(t => t.assignedTo === u.id && t.status === "done").length;
          return (
            <article key={u.id} className="team-card">
              <div className="team-top">
                <Avatar user={u} size={44} />
                <div>
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
                <span className={`role-pill ${u.role === "admin" ? "role-admin" : ""}`}>{u.role}</span>
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
                  <strong>{assigned ? Math.round((done / assigned) * 100) : 0}%</strong>
                </div>
              </div>
              {currentUser.role === "admin" && u.id !== currentUser.id ? (
                <select value={u.role} onChange={e => onChangeRole(u.id, e.target.value)} className="role-select">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div className="role-readonly">Role locked</div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default TeamView;