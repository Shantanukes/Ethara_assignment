import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className={`confirm-icon ${danger ? 'danger' : ''}`}>
          <i className={`ti ${danger ? 'ti-trash' : 'ti-alert-circle'}`} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-msg">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>Cancel</button>
          <button className={`confirm-btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
