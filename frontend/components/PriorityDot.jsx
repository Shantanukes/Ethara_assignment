import React from 'react';
import { PRIORITY_MAP } from '../constants';

function PriorityDot({ priority }) {
  const p = PRIORITY_MAP[priority] || PRIORITY_MAP.medium;
  return (
    <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:p.fg, fontWeight:500 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:p.fg, flexShrink:0 }} />
      {priority.charAt(0).toUpperCase()+priority.slice(1)}
    </span>
  );
}

export default PriorityDot;