import React, { createContext, useContext, useState, useCallback } from 'react';
import './modal.css';

// ===== CONTEXT =====
const ModalContext = createContext(null);

// ===== ICONS =====
const CheckCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const AlertTriangleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const XCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const QuestionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ICONS = {
  success: { component: <CheckCircleIcon />, colorClass: 'modal-icon--success' },
  warning: { component: <AlertTriangleIcon />, colorClass: 'modal-icon--warning' },
  error: { component: <XCircleIcon />, colorClass: 'modal-icon--error' },
  info: { component: <InfoIcon />, colorClass: 'modal-icon--info' },
  delete: { component: <TrashIcon />, colorClass: 'modal-icon--error' },
  confirm: { component: <QuestionIcon />, colorClass: 'modal-icon--info' },
};

// ===== MODAL COMPONENT =====
function Modal({ config, onClose }) {
  if (!config) return null;

  const { type = 'info', title, message, confirmText, cancelText, onConfirm, isAlert } = config;
  const icon = ICONS[type] || ICONS.info;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (isAlert) onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <XIcon />
        </button>

        <div className={`modal-icon-wrap ${icon.colorClass}`}>
          {icon.component}
        </div>

        <div className="modal-content">
          {title && <h3 className="modal-title">{title}</h3>}
          {message && <p className="modal-message">{message}</p>}
        </div>

        <div className={`modal-actions ${isAlert ? 'modal-actions--single' : ''}`}>
          {type === 'auth' ? (
            <>
              <button className="modal-btn modal-btn--cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn modal-btn--secondary" onClick={() => { window.location.hash = '#auth/login'; onClose(); }} style={{ background: '#f1f5f9', color: '#0f172a' }}>
                Log In
              </button>
              <button className="modal-btn modal-btn--primary" onClick={() => { window.location.hash = '#auth/signup'; onClose(); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              {!isAlert && (
                <button className="modal-btn modal-btn--cancel" onClick={onClose}>
                  {cancelText || 'Cancel'}
                </button>
              )}
              <button
                className={`modal-btn ${type === 'delete' || type === 'error' ? 'modal-btn--danger' : 'modal-btn--primary'}`}
                onClick={handleConfirm}
              >
                {confirmText || (isAlert ? 'Got it' : 'Confirm')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== PROVIDER =====
export function ModalProvider({ children }) {
  const [config, setConfig] = useState(null);

  const showAlert = useCallback(({ title, message, type = 'info', confirmText }) => {
    return new Promise((resolve) => {
      setConfig({
        title, message, type, confirmText,
        isAlert: true,
        onConfirm: resolve,
      });
    });
  }, []);

  const showConfirm = useCallback(({ title, message, type = 'confirm', confirmText, cancelText }) => {
    return new Promise((resolve) => {
      setConfig({
        title, message, type, confirmText, cancelText,
        isAlert: false,
        onConfirm: () => resolve(true),
      });
      // On backdrop/cancel close, resolve false
      // We override onClose to resolve(false)
    });
  }, []);

  const handleClose = useCallback(() => {
    setConfig(null);
  }, []);

  // For confirm, closing without confirming should resolve false
  const [pendingReject, setPendingReject] = useState(null);

  const showConfirmInternal = useCallback(({ title, message, type = 'confirm', confirmText, cancelText }) => {
    return new Promise((resolve) => {
      setConfig({
        title, message, type, confirmText, cancelText,
        isAlert: false,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const showAuthModal = useCallback(({ title, message }) => {
    return new Promise((resolve) => {
      setConfig({
        title, message, type: 'auth',
        isAlert: false,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    if (config?.onCancel) config.onCancel();
    setConfig(null);
  }, [config]);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm: showConfirmInternal, showAuthModal }}>
      {children}
      {config && <Modal config={config} onClose={handleCloseModal} />}
    </ModalContext.Provider>
  );
}

// ===== HOOK =====
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>');
  return ctx;
}
