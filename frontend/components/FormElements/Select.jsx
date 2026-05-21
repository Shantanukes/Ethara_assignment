import React from 'react';

function Select({ label, className = "", children, ...props }) {
  return (
    <div className="select-field">
      {label && <label className="field-label">{label}</label>}
      <select className={`auth-input auth-select ${className}`} {...props}>{children}</select>
    </div>
  );
}

export default Select;