import React from "react";

import "./Modal.css";

const Modal = ({
  title,
  confirmText,
  canCancel,
  canConfirm,
  children,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="backdrop">
      <div className="modal">
        <header className="modal__header">
          <h1>{title}</h1>
        </header>
        <section className="modal__content">{children}</section>
        <section className="modal__actions">
          {canConfirm && (
            <button className="btn" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
          {canCancel && (
            <button className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  confirmText: "Confirm"
};

export default Modal;
