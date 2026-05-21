import { useState, useEffect } from "react";
import axios from 'axios';
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
import { fd, AKEYS } from "./constants";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [activeProjId, setActiveProjId] = useState(null);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const buildMockData = () => {
      const mockUsers = [
        { id: "u1", name: "Admin User", email: "admin@test.com", password: "password", role: "admin", initials: "AU", color: AKEYS[0] },
        { id: "u2", name: "Member One", email: "member1@test.com", password: "password", role: "member", initials: "MO", color: AKEYS[1] },
        { id: "u3", name: "Member Two", email: "member2@test.com", password: "password", role: "member", initials: "MT", color: AKEYS[2] },
      ];

      const mockProjects = [
        { id: "p1", name: "Project Alpha", description: "Core product build", createdBy: "u1", members: ["u1", "u2"] },
        { id: "p2", name: "Project Beta", description: "Growth experiments", createdBy: "u2", members: ["u2", "u3"] },
      ];

      const nowIso = new Date().toISOString();
      const mockTasks = [
        { id: "t1", title: "Design homepage", projectId: "p1", assignedTo: "u1", priority: "high", dueDate: fd(5), status: "in-progress", createdAt: nowIso },
        { id: "t2", title: "Develop API for authentication", projectId: "p1", assignedTo: "u2", priority: "high", dueDate: fd(7), status: "todo", createdAt: nowIso },
        { id: "t3", title: "Write docs for Project Beta", projectId: "p2", assignedTo: "u3", priority: "medium", dueDate: fd(10), status: "todo", createdAt: nowIso },
        { id: "t4", title: "Test new features", projectId: "p2", assignedTo: "u2", priority: "low", dueDate: fd(12), status: "done", createdAt: nowIso },
      ];

      return { mockUsers, mockProjects, mockTasks };
    };

    const { mockUsers, mockProjects, mockTasks } = buildMockData();

    Promise.allSettled([
      axios.get(`${API_BASE_URL}/users/`),
      axios.get(`${API_BASE_URL}/projects/`),
      axios.get(`${API_BASE_URL}/tasks/`),
    ])
      .then(([usersRes, projectsRes, tasksRes]) => {
        const usersData = usersRes.status === "fulfilled" ? usersRes.value.data : null;
        const projectsData = projectsRes.status === "fulfilled" ? projectsRes.value.data : null;
        const tasksData = tasksRes.status === "fulfilled" ? tasksRes.value.data : null;

        const hasRemote = Array.isArray(usersData) && usersData.length > 0
          && Array.isArray(projectsData) && projectsData.length > 0
          && Array.isArray(tasksData) && tasksData.length > 0;

        if (hasRemote) {
          setUsers(usersData.map(u => ({ ...u, id: u._id })));
          setProjects(projectsData.map(p => ({ ...p, id: p._id })));
          setTasks(tasksData.map(t => ({ ...t, id: t._id })));
          return;
        }

        setUsers(mockUsers);
        setProjects(mockProjects);
        setTasks(mockTasks);
      })
      .catch(() => {
        setUsers(mockUsers);
        setProjects(mockProjects);
        setTasks(mockTasks);
      });
  }, []);

  const close = () => setModal(null);

  const visibleProjects = currentUser
    ? (currentUser.role === "admin" ? projects : projects.filter(p => p.members.includes(currentUser.id)))
    : [];

  const activeProject = projects.find(p => p.id === activeProjId);

  const saveTask = (form) => {
    if (modal?.task?.id) {
        axios.post(`${API_BASE_URL}/tasks/update/` + modal.task.id, { status: form.status })
            .then(res => console.log(res.data));
      setTasks(ts => ts.map(t => t.id === modal.task.id ? { ...t, ...form } : t));
    } else {
        const newTaskPayload = { ...form };
        axios.post(`${API_BASE_URL}/tasks/add`, newTaskPayload)
            .then(res => {
                setTasks(ts => [...ts, { ...res.data, id: res.data._id }]);
            });
    }
    close();
  };

  const saveProject = (form) => {
    const newProjectPayload = { ...form, createdBy: currentUser.id };
    axios.post(`${API_BASE_URL}/projects/add`, newProjectPayload)
        .then(res => {
            setProjects(ps => [...ps, { ...res.data, id: res.data._id }]);
        });
    close();
  };

  const viewProject = (id) => { setActiveProjId(id); setView("project-detail"); };

  if (!currentUser) {
    return <AuthScreen users={users} setUsers={setUsers} onLogin={setCurrentUser} />;
  }

  const getModalTitle = () => {
    if (!modal) return "";
    if (modal.type === "create-task") return "Create task";
    if (modal.type === "edit-task") return "Edit task";
    return "New project";
  };

  return (
    <div className="app-shell">
      <Sidebar
        currentUser={currentUser}
        view={view}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNav={v => { setView(v); setActiveProjId(null); setSidebarOpen(false); }}
        onLogout={() => { setCurrentUser(null); setView("dashboard"); }}
      />

      <div className={`sidebar-overlay ${sidebarOpen ? "is-open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <main className="main-content">
        {view === "dashboard" && (
          <DashboardView tasks={tasks} projects={visibleProjects} users={users}
            currentUser={currentUser}
            onNewTask={() => setModal({ type: "create-task", task: null })}
            onViewProject={viewProject}
            onToggleSidebar={() => setSidebarOpen(true)} />
        )}
        {view === "projects" && (
          <ProjectsView projects={visibleProjects} tasks={tasks} users={users}
            currentUser={currentUser}
            onNewProject={() => setModal({ type: "create-project" })}
            onViewProject={viewProject}
            onDeleteProject={id => { 
                axios.delete(`${API_BASE_URL}/projects/`+id)
                    .then(response => { console.log(response.data)});
                setProjects(ps => ps.filter(p => p.id !== id)); 
                setTasks(ts => ts.filter(t => t.projectId !== id)); 
            }} />
        )}
        {view === "tasks" && (
          <MyTasksView tasks={tasks} projects={projects} users={users} currentUser={currentUser}
            onNewTask={() => setModal({ type: "create-task", task: null })}
            onEditTask={t => setModal({ type: "edit-task", task: t })}
            onDeleteTask={id => {
                axios.delete(`${API_BASE_URL}/tasks/`+id)
                    .then(response => { console.log(response.data)});
                setTasks(ts => ts.filter(t => t.id !== id))
            }}
            onStatusChange={(id, s) => {
                axios.post(`${API_BASE_URL}/tasks/update/` + id, { status: s })
                    .then(res => console.log(res.data));
                setTasks(ts => ts.map(t => t.id === id ? { ...t, status: s } : t))
            }} />
        )}
        {view === "team" && (
          <TeamView users={users} tasks={tasks} currentUser={currentUser}
            onChangeRole={(uid, role) => {
              axios.post(`${API_BASE_URL}/users/update/${uid}`, { role })
                .then(res => console.log(res.data))
                .catch(err => console.error("Error updating role:", err));
              setUsers(us => us.map(u => u.id === uid ? { ...u, role } : u));
            }} />
        )}
        {view === "project-detail" && activeProject && (
          <ProjectDetailView project={activeProject} tasks={tasks} users={users}
            currentUser={currentUser}
            onNewTask={() => setModal({ type: "create-task", task: null })}
            onEditTask={t => setModal({ type: "edit-task", task: t })}
            onDeleteTask={id => {
                axios.delete(`${API_BASE_URL}/tasks/`+id)
                    .then(response => { console.log(response.data)});
                setTasks(ts => ts.filter(t => t.id !== id))
            }}
            onStatusChange={(id, s) => {
                axios.post(`${API_BASE_URL}/tasks/update/` + id, { status: s })
                    .then(res => console.log(res.data));
                setTasks(ts => ts.map(t => t.id === id ? { ...t, status: s } : t))
            }}
            onBack={() => setView("projects")} />
        )}
      </main>

      {modal && (
        <ModalOverlay title={getModalTitle()} onClose={close}>
          {(modal.type === "create-task" || modal.type === "edit-task") && (
            <TaskForm
              init={modal.task ? modal.task : (activeProjId ? { projectId: activeProjId } : null)}
              projects={visibleProjects} users={users} currentUser={currentUser}
              onSave={saveTask} onClose={close} />
          )}
          {modal.type === "create-project" && (
            <ProjectForm users={users} currentUser={currentUser} onSave={saveProject} onClose={close} />
          )}
        </ModalOverlay>
      )}
    </div>
  );
}
