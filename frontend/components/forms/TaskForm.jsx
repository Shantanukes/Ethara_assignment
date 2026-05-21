import React, { useState } from 'react';
import { fd } from '../../constants';
import Input from '../FormElements/Input';
import Textarea from '../FormElements/Textarea';
import Select from '../FormElements/Select';
import Btn from '../FormElements/Btn';

function TaskForm({ init, projects, users, currentUser, onSave, onClose }) {
  const [f, setF] = useState(init || {
    title:"", description:"", projectId:projects[0]?.id||"",
    assignedTo:currentUser.id, status:"todo", priority:"medium", dueDate:fd(7)
  });
  const set = (k) => (e) => setF(p => ({ ...p, [k]:e.target.value }));
  const proj = projects.find(p => p.id === f.projectId);
  const members = proj ? users.filter(u => proj.members.includes(u.id)) : users;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Input label="Task title *" value={f.title} onChange={set("title")} placeholder="What needs to be done?" />
      <Textarea label="Description" value={f.description} onChange={set("description")} placeholder="Optional details…" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Select label="Project" value={f.projectId} onChange={set("projectId")}>
          <option value="" disabled>Select project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Select label="Assign to" value={f.assignedTo} onChange={set("assignedTo")}>
          <option value="" disabled>Select member</option>
          {members.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <Select label="Status" value={f.status} onChange={set("status")}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
        <Select label="Priority" value={f.priority} onChange={set("priority")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>
      <Input label="Due date" type="date" value={f.dueDate} onChange={set("dueDate")} />
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end", paddingTop:4 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={() => { if (!f.title.trim()) return; onSave(f); }}>
          {init?.id ? "Save changes" : "Create task"}
        </Btn>
      </div>
    </div>
  );
}

export default TaskForm;