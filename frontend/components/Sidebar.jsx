import React from 'react';
import Avatar from './Avatar';
import './Sidebar.css';

function Sidebar({ currentUser, view, onNav, onLogout, isOpen, onClose }) {
  const NAV = [
    { id:"dashboard", icon:"ti-layout-dashboard", label:"Dashboard" },
    { id:"projects",  icon:"ti-folder",           label:"Projects"  },
    { id:"tasks",     icon:"ti-list-check",        label:"My Tasks"  },
    { id:"team",      icon:"ti-users",             label:"Team"      },
  ];
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="sidebar-header">
        <div className="brand-mark">
          <i className="ti ti-layout-kanban" aria-hidden="true" />
        </div>
        <span className="brand-name">TaskFlow</span>
        <span className="role-pill">{currentUser.role}</span>
        <button className="sidebar-close mobile-only" onClick={onClose} aria-label="Close menu">
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`nav-item ${view === item.id ? "active" : ""}`}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar user={currentUser} size={34} />
          <div>
            <p>{currentUser.name}</p>
            <span>{currentUser.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <i className="ti ti-logout" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;