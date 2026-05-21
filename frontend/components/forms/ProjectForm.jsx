import React, { useState } from 'react';
import Input from '../FormElements/Input';
import Textarea from '../FormElements/Textarea';
import Btn from '../FormElements/Btn';
import Avatar from '../Avatar';

function ProjectForm({ users, currentUser, onSave, onClose }) {
  const [f, setF] = useState({ name:"", description:"", members:[currentUser.id] });
  const set = (k) => (e) => setF(p => ({ ...p, [k]:e.target.value }));
  const toggle = (uid) => setF(p => ({
    ...p, members: p.members.includes(uid) ? p.members.filter(i=>i!==uid) : [...p.members, uid]
  }));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Input label="Project name *" value={f.name} onChange={set("name")} placeholder="e.g. Q3 Campaign" />
      <Textarea label="Description" value={f.description} onChange={set("description")} placeholder="What is this project about?" />
      <div>
        <label style={{ fontSize:13, color:"var(--color-text-secondary)", display:"block", marginBottom:8 }}>Team members</label>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {users.map(u => {
            const checked = f.members.includes(u.id);
            return (
              <label key={u.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                padding:"7px 10px", borderRadius:"var(--border-radius-md)",
                background: checked ? "#E1F5EE" : "var(--color-background-secondary)",
                border:"0.5px solid " + (checked ? "#5DCAA5" : "transparent") }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(u.id)} disabled={u.id===currentUser.id} style={{ margin:0 }} />
                <Avatar user={u} size={28} />
                <span style={{ fontSize:14, flex:1 }}>{u.name}</span>
                <span style={{ fontSize:12, color:"var(--color-text-tertiary)" }}>{u.role}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end", paddingTop:4 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => { if (!f.name.trim()) return; onSave({ ...f, members:[...new Set([currentUser.id,...f.members])] }); }}>
          Create project
        </Btn>
      </div>
    </div>
  );
}

export default ProjectForm;