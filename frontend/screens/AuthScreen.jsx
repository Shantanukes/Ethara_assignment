import React, { useState } from 'react';
import axios from 'axios';
import { AKEYS } from '../constants';
import Input from '../components/FormElements/Input';
import Select from '../components/FormElements/Select';
import Btn from '../components/FormElements/Btn';
import './AuthScreen.css';

function AuthScreen({ users, setUsers, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setError("");
    if (mode === "login") {
      const email = form.email.trim().toLowerCase();
      const password = form.password.trim();
      const u = users.find(u => u.email.toLowerCase() === email && u.password === password);
      if (!u) { setError("Invalid email or password."); return; }
      onLogin(u);
    } else {
      const name = form.name.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password.trim();
      if (!name || !email || !password) { setError("All fields are required."); return; }
      if (users.find(u => u.email.toLowerCase() === email)) { setError("Email already in use."); return; }
      const initials = form.name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
      const nu = {
        name, email,
        password, role: form.role, initials, color: AKEYS[users.length % AKEYS.length]
      };

      const addLocalUser = () => {
        const userWithId = { ...nu, id: `local-${Date.now()}` };
        setUsers(u => [...u, userWithId]);
        onLogin(userWithId);
      };

      axios.post('http://localhost:5000/users/add', nu)
        .then(res => {
          const userWithId = { ...res.data, id: res.data._id };
          setUsers(u => [...u, userWithId]);
          onLogin(userWithId);
        })
        .catch(() => {
          addLocalUser();
        });
    }
  };

  const demoUsers = [
    { email: 'admin@test.com', password: 'password', role: 'Admin' },
    { email: 'member1@test.com', password: 'password', role: 'Member' },
    { email: 'member2@test.com', password: 'password', role: 'Member' },
  ];

  return (
    <div className="auth-screen">
      <div className="auth-layout">
        <div className="auth-branding">
          <div className="branding-top">
            <span className="branding-chip">TaskFlow Workspace</span>
            <h1>Plan, build, ship—together.</h1>
            <p>Your team's calm center for projects, tasks, and momentum. Sign in to get moving.</p>
          </div>
          <div className="demo-credentials">
            <h3>Demo Accounts</h3>
            <ul>
              {demoUsers.map(user => (
                <li key={user.email}>
                  <strong>{user.role}:</strong> <code>{user.email}</code> / <code>{user.password}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <div className="icon-container">
                <i className="ti ti-layout-kanban" aria-hidden="true" />
              </div>
              <h2>TaskFlow</h2>
              <p className="auth-subtitle">
                {mode === "login" ? "Welcome back. Lets get to work." : "Start your new workspace in minutes."}
              </p>
            </div>

            <div className="auth-form">
              <div className="tab-buttons">
                <button onClick={() => { setMode("login"); setError(""); }} className={mode === 'login' ? 'active' : ''}>
                  Sign In
                </button>
                <button onClick={() => { setMode("signup"); setError(""); }} className={mode === 'signup' ? 'active' : ''}>
                  Create Account
                </button>
              </div>

              <div className="form-fields">
                {mode === "signup" && (
                  <div className="field">
                    <Input label="Full name" value={form.name} onChange={set("name")} placeholder="Your name" className="auth-input" />
                  </div>
                )}
                <div className="field">
                  <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="auth-input" />
                </div>
                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="password-wrap">
                    <input
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="Enter your password"
                      onKeyDown={e => e.key === "Enter" && submit()}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                {mode === "signup" && (
                  <div className="field">
                    <Select label="Role" value={form.role} onChange={set("role")}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </div>
                )}
                {mode === "login" && (
                  <button type="button" className="link-btn">Forgot password?</button>
                )}
                {error && <p className="error-message">{error}</p>}
                <Btn variant="primary" onClick={submit} style={{ width: "100%", justifyContent: "center", padding: "12px 0", marginTop: 8, fontSize: 15 }}>
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Btn>
                <div className="divider"><span>or</span></div>
                <button type="button" className="google-btn" aria-label="Continue with Google">
                  <span className="google-icon">G</span>
                  Continue with Google
                </button>
                <p className="legal-text">
                  By continuing, you agree to the Terms and acknowledge the Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;