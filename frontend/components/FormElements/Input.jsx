import React from 'react';

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize:13, color:"var(--color-text-secondary)", display:"block", marginBottom:4 }}>{label}</label>}
      <input style={{ width:"100%", boxSizing:"border-box" }} {...props} />
    </div>
  );
}

export default Input;