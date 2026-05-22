import { useState, useEffect, useCallback } from "react";
import AuthScreen from "./screens/AuthScreen";
import DashboardView from "./screens/DashboardView";
import ProjectsView from "./screens/ProjectsView";
import MyTasksView from "./screens/MyTasksView";
import TeamView from "./screens/TeamView";
import ProjectDetailView from "./screens/ProjectDetailView";
import Sidebar from "./components/Sidebar";
import ModalOverlay from "./components/ModalOverlay";
import TaskForm from "./components/forms/TaskForm";
import ProjectForm from "./components/forms/ProjectForm";
import ConfirmModal from "./components/ConfirmModal";
import { useToast } from "./components/Toast";
import {
  fetchUsers, fetchProjects, fetchTasks,
  createTask, updateTask, deleteTask, deleteTasksByProject,
  createProject, updateProject, deleteProject,
  updateUserRole, deleteUser, errMsg,
} from "./services/api";
import { AKEYS } from "./constants";
import "./App.css";

// Normalize MongoDB doc: _id → id, stringify ObjectId refs
const nu = (u) => ({ ...u, id: String(u._id) });
const np = (p) => ({ ...p, id: String(p._id), createdBy: String(p.createdBy), members: (p.members || []).map(String) });
const nt = (t) => ({
  ...t, id: String(t._id),
  projectId: String(t.projectId || ''),
  assignedTo: String(t.assignedTo || ''),
  dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
  createdAt: t.createdAt || new Date().toISOString(),
});

// ── Dark mode helpers ────────────────────────────────────────────────────────
const applyDark = (on) => document.documentElement.classList.toggle('dark', on);

export default function App() {
  const toast = useToast();

  // ── Auth state ─────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('taskflow_user')); } catch { return null; }
  });

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow_dark') === 'true');
  useEffect(() => { applyDark(dark); localStorage.setItem('taskflow_dark', dark); }, [dark]);

  // ── Data state ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── View state ─────────────────────────────────────────────────────────────
  const [view, setView] = useState('dashboard');
  const [activeProjId, setActiveProjId] = useState(null);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }

  // ── Auth handlers ──────────────────────────────────────────────────────────
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
  };

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    setView('dashboard');
    setUsers([]); setProjects([]); setTasks([]);
    toast.info('Logged out successfully');
  }, [toast]);

  // Auto-logout on 401
  useEffect(() => {
    const handler = () => { handleLogout(); toast.warning('Session expired. Please sign in again.'); };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [handleLogout, toast]);

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [usersData, projectsData, tasksData] = await Promise.all([
        fetchUsers(), fetchProjects(), fetchTasks(),
      ]);
      setUsers((usersData || []).map(nu));
      setProjects((projectsData || []).map(np));
      setTasks((tasksData || []).map(nt));
    } catch (err) {
      // If 401, already handled by interceptor; otherwise show error
      if (err.response?.status !== 401) {
        toast.error('Failed to load data: ' + errMsg(err));
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const close = () => setModal(null);
  const visibleProjects = currentUser
    ? (currentUser.role === 'admin' ? projects : projects.filter(p => p.members.includes(currentUser.id)))
    : [];
  const activeProject = projects.find(p => p.id === activeProjId);

  // ── TASK CRUD ──────────────────────────────────────────────────────────────
  const saveTask = async (form) => {
    close();
    if (modal?.task?.id) {
      // Optimistic update
      setTasks(ts => ts.map(t => t.id === modal.task.id ? { ...t, ...form } : t));
      try {
        await updateTask(modal.task.id, form);
        toast.success('Task updated successfully');
      } catch (err) {
        toast.error('Failed to update task: ' + errMsg(err));
        loadData(); // rollback
      }
    } else {
      try {
        const saved = await createTask(form);
        setTasks(ts => [nt(saved), ...ts]);
        toast.success('Task created successfully');
      } catch (err) {
        toast.error('Failed to create task: ' + errMsg(err));
      }
    }
  };

  const handleDeleteTask = (id) => {
    setConfirm({
      title: 'Delete task',
      message: 'This task will be permanently deleted. This cannot be undone.',
      onConfirm: async () => {
        setConfirm(null);
        setTasks(ts => ts.filter(t => t.id !== id)); // optimistic
        try {
          await deleteTask(id);
          toast.success('Task deleted');
        } catch (err) {
          toast.error('Failed to delete task: ' + errMsg(err));
          loadData(); // rollback
        }
      },
    });
  };

  const handleStatusChange = async (id, status) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t)); // optimistic
    try {
      await updateTask(id, { status });
    } catch (err) {
      toast.error('Failed to update status: ' + errMsg(err));
      loadData(); // rollback
    }
  };

  // ── PROJECT CRUD ───────────────────────────────────────────────────────────
  const saveProject = async (form) => {
    close();
    if (modal?.project?.id) {
      setProjects(ps => ps.map(p => p.id === modal.project.id ? { ...p, ...form } : p)); // optimistic
      try {
        await updateProject(modal.project.id, form);
        toast.success('Project updated');
      } catch (err) {
        toast.error('Failed to update project: ' + errMsg(err));
        loadData();
      }
    } else {
      try {
        const saved = await createProject({ ...form, createdBy: currentUser.id });
        setProjects(ps => [np(saved), ...ps]);
        toast.success('Project created');
      } catch (err) {
        toast.error('Failed to create project: ' + errMsg(err));
      }
    }
  };

  const handleDeleteProject = (id) => {
    const proj = projects.find(p => p.id === id);
    setConfirm({
      title: 'Delete project',
      message: `"${proj?.name}" and all its tasks will be permanently deleted.`,
      onConfirm: async () => {
        setConfirm(null);
        setProjects(ps => ps.filter(p => p.id !== id));
        setTasks(ts => ts.filter(t => t.projectId !== id));
        try {
          await Promise.all([deleteProject(id), deleteTasksByProject(id)]);
          toast.success('Project deleted');
        } catch (err) {
          toast.error('Failed to delete project: ' + errMsg(err));
          loadData();
        }
      },
    });
  };

  // ── TEAM ───────────────────────────────────────────────────────────────────
  const handleChangeRole = async (uid, role) => {
    setUsers(us => us.map(u => u.id === uid ? { ...u, role } : u));
    try {
      await updateUserRole(uid, role);
      toast.success('Role updated');
    } catch (err) {
      toast.error('Failed to update role: ' + errMsg(err));
      loadData();
    }
  };

  const handleDeleteUser = (uid) => {
    const user = users.find(u => u.id === uid);
    setConfirm({
      title: 'Remove member',
      message: `Remove ${user?.name} from the workspace?`,
      confirmLabel: 'Remove',
      onConfirm: async () => {
        setConfirm(null);
        setUsers(us => us.filter(u => u.id !== uid));
        try {
          await deleteUser(uid);
          toast.success('Member removed');
        } catch (err) {
          toast.error('Failed to remove member: ' + errMsg(err));
          loadData();
        }
      },
    });
  };

  const viewProject = (id) => { setActiveProjId(id); setView('project-detail'); };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!currentUser) {
    return <AuthScreen users={users} onLogin={handleLogin} />;
  }

  const getModalTitle = () => {
    if (!modal) return '';
    if (modal.type === 'create-task') return 'Create task';
    if (modal.type === 'edit-task') return 'Edit task';
    if (modal.type === 'edit-project') return 'Edit project';
    return 'New project';
  };

  const sharedTaskProps = {
    onNewTask: () => setModal({ type: 'create-task', task: null }),
    onEditTask: t => setModal({ type: 'edit-task', task: t }),
    onDeleteTask: handleDeleteTask,
    onStatusChange: handleStatusChange,
  };

  return (
    <div className={`app-shell${dark ? ' dark' : ''}`}>
      <Sidebar
        currentUser={currentUser}
        view={view}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNav={v => { setView(v); setActiveProjId(null); setSidebarOpen(false); }}
        onLogout={handleLogout}
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
      />

      <div className={`sidebar-overlay ${sidebarOpen ? 'is-open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <main className="main-content">
        {loading && <div className="global-loader"><div className="spinner" /></div>}

        {view === 'dashboard' && (
          <DashboardView tasks={tasks} projects={visibleProjects} users={users}
            currentUser={currentUser} loading={loading}
            onViewAllTasks={() => setView('tasks')}
            onViewProject={viewProject}
            onToggleSidebar={() => setSidebarOpen(true)}
            onToggleDark={() => setDark(d => !d)} dark={dark}
            {...sharedTaskProps} />
        )}
        {view === 'projects' && (
          <ProjectsView projects={visibleProjects} tasks={tasks} users={users}
            currentUser={currentUser}
            onNewProject={() => setModal({ type: 'create-project' })}
            onViewProject={viewProject}
            onEditProject={p => setModal({ type: 'edit-project', project: p })}
            onDeleteProject={handleDeleteProject} />
        )}
        {view === 'tasks' && (
          <MyTasksView tasks={tasks} projects={projects} users={users}
            currentUser={currentUser}
            {...sharedTaskProps} />
        )}
        {view === 'team' && (
          <TeamView users={users} tasks={tasks} currentUser={currentUser}
            onChangeRole={handleChangeRole}
            onDeleteUser={handleDeleteUser} />
        )}
        {view === 'project-detail' && activeProject && (
          <ProjectDetailView project={activeProject} tasks={tasks} users={users}
            currentUser={currentUser}
            onBack={() => setView('projects')}
            {...sharedTaskProps} />
        )}
      </main>

      {/* Task / Project modals */}
      {modal && (
        <ModalOverlay title={getModalTitle()} onClose={close}>
          {(modal.type === 'create-task' || modal.type === 'edit-task') && (
            <TaskForm
              init={modal.task || (activeProjId ? { projectId: activeProjId } : null)}
              projects={visibleProjects} users={users} currentUser={currentUser}
              onSave={saveTask} onClose={close} />
          )}
          {(modal.type === 'create-project' || modal.type === 'edit-project') && (
            <ProjectForm
              init={modal.project || null}
              users={users} currentUser={currentUser}
              onSave={saveProject} onClose={close} />
          )}
        </ModalOverlay>
      )}

      {/* Styled confirm dialog */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel || 'Delete'}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}
