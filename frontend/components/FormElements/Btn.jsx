import React from 'react';
import './Btn.css';

function Btn({ children, variant = "default", style: s = {}, className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} style={s} {...props}>
      {children}
    </button>
  );
}

export default Btn;