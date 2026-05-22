import React, { useState } from 'react';
import { login, register, errMsg } from '../services/api';
import { AKEYS } from '../constants';
import Input from '../components/FormElements/Input';
import Select from '../components/FormElements/Select';
import Btn from '../components/FormElements/Btn';
import { useToast } from '../components/Toast';
import './AuthScreen.css';

function AuthScreen({ users, onLogin }) {
  const toast = useToast();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login(form.email.trim(), form.password.trim());
        localStorage.setItem('taskflow_token', data.token);
        const user = { ...data.user, id: String(data.user._id || data.user.id) };
        onLogin(user);
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      } else {
        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();
        const password = form.password.trim();
        if (!name || !email || !password) { setError('All fields are required.'); return; }

        const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        const color = AKEYS[(users?.length || 0) % AKEYS.length];
        const data = await register({ name, email, password, role: form.role, initials, color });
        localStorage.setItem('taskflow_token', data.token);
        const user = { ...data.user, id: String(data.user._id || data.user.id) };
        onLogin(user);
        toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}!`);
      }
    } catch (err) {
      const msg = errMsg(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { email: 'admin@test.com', password: 'password', role: 'Admin' },
    { email: 'member1@test.com', password: 'password', role: 'Member' },
    { email: 'member2@test.com', password: 'password', role: 'Member' },
  ];

  const quickLogin = async (email, password) => {
    setForm(f => ({ ...f, email, password }));
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('taskflow_token', data.token);
      const user = { ...data.user, id: String(data.user._id || data.user.id) };
      onLogin(user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

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
            <h3>Quick Login</h3>
            <ul>
              {demoUsers.map(user => (
                <li key={user.email}>
                  <button
                    className="demo-login-btn"
                    onClick={() => quickLogin(user.email, user.password)}
                    disabled={loading}
                  >
                    <strong>{user.role}</strong>
                    <code>{user.email}</code>
                  </button>
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
                {mode === 'login' ? "Welcome back. Let's get to work." : 'Start your new workspace in minutes.'}
              </p>
            </div>

            <div className="auth-form">
              <div className="tab-buttons">
                <button onClick={() => { setMode('login'); setError(''); }} className={mode === 'login' ? 'active' : ''}>
                  Sign In
                </button>
                <button onClick={() => { setMode('signup'); setError(''); }} className={mode === 'signup' ? 'active' : ''}>
                  Create Account
                </button>
              </div>

              <div className="form-fields">
                {mode === 'signup' && (
                  <div className="field">
                    <Input label="Full name" value={form.name} onChange={set('name')} placeholder="Your name" className="auth-input" />
                  </div>
                )}
                <div className="field">
                  <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="auth-input" />
                </div>
                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="password-wrap">
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Enter your password"
                      onKeyDown={e => e.key === 'Enter' && submit()}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {mode === 'signup' && (
                  <div className="field">
                    <Select label="Role" value={form.role} onChange={set('role')}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </div>
                )}
                {error && <p className="error-message">{error}</p>}
                <Btn
                  variant="primary"
                  onClick={submit}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 0', marginTop: 8, fontSize: 15 }}
                >
                  {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </Btn>
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