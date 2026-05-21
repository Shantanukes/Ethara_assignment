import React from 'react';

function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize:13, color:"var(--color-text-secondary)", display:"block", marginBottom:4 }}>{label}</label>}
      <textarea style={{ width:"100%", boxSizing:"border-box", resize:"vertical", minHeight:72,
        fontFamily:"var(--font-sans)", fontSize:14, padding:"8px 12px",
        border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)",
        background:"transparent", color:"var(--color-text-primary)" }} {...props} />
    </div>
  );
}

export default Textarea;