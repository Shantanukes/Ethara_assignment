import React from 'react';
import { STATUS_MAP } from '../constants';

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.todo;
  return (
    <span style={{ background:s.bg, color:s.fg, padding:"2px 10px",
      borderRadius:999, fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

export default StatusBadge;