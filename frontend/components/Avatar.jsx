import React from 'react';
import { AVATAR_COLORS } from '../constants';

function Avatar({ user, size = 32 }) {
  const c = AVATAR_COLORS[user.color] || AVATAR_COLORS.blue;
  return (
    <div title={user.name} style={{ width:size, height:size, borderRadius:"50%", background:c.bg, color:c.fg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.34, fontWeight:500, flexShrink:0, userSelect:"none" }}>
      {user.initials}
    </div>
  );
}

export default Avatar;