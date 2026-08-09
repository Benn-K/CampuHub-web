import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../components/modal/ModalContext';
import './auth.css';

// ===== ICONS =====
const KeyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#005DE3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CampuHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
    <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
    <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.6)" />
  </svg>
);

const router = {
  replace: (route) => {
    window.location.hash = `#${route.replace(/^\/+/, '')}`;
  },
  back: () => {
    window.history.back();
  }
};

export default function ResetPasswordPage() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useModal();

  // Extract email from URL parameters
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (window.location.hash.includes('?')) {
      const query = window.location.hash.split('?')[1];
      const params = new URLSearchParams(query);
      if (params.get('email')) {
        setEmail(params.get('email'));
      }
    }
  }, []);

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      await showAlert({ title: 'Missing Info', message: 'Please fill out all fields.', type: 'warning' });
      return;
    }

    if (newPassword !== confirmPassword) {
      await showAlert({ title: 'Password Mismatch', message: 'Your new passwords do not match.', type: 'warning' });
      return;
    }

    if (newPassword.length < 6) {
      await showAlert({ title: 'Weak Password', message: 'Password must be at least 6 characters.', type: 'warning' });
      return;
    }

    setIsLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: code.trim(),
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      await showAlert({ title: 'Password Reset!', message: 'Your password has been successfully reset. Please log in with your new password.', type: 'success' });
      router.replace('/auth/login');

    } catch (error) {
      await showAlert({ title: 'Reset Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleResetPassword();
  };

  return (
    <div className="auth-page">
      {/* ===== LEFT PANEL ===== */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <CampuHubLogo />
            </div>
            <span className="auth-logo-text">CampuHub</span>
          </div>
          <h1 className="auth-title">Reset<br />password.</h1>
          <p className="auth-subtitle">
            Securely set a new password to regain access to your account and continue browsing campus deals.
          </p>
        </div>

        <div className="auth-trust-badges">
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><ShieldIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>Safe & Secure</strong>
              <span>All accounts are university-verified</span>
            </div>
          </div>
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><StarIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>Trusted Ratings</strong>
              <span>Review and rate every transaction</span>
            </div>
          </div>
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><ZapIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>Instant Deals</strong>
              <span>Chat, agree, meet — it's that simple</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="auth-right">
        <button className="auth-skip" onClick={() => router.replace('/auth/login')}>
          Back to Login
        </button>
        <div className="auth-card auth-card--scrollable">
          
          <div className="auth-card-header" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '70px', height: '70px', borderRadius: '35px', 
                backgroundColor: '#f1f5f9', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
              }}>
                <KeyIcon />
              </div>
            </div>
            <h2>Reset Password</h2>
            <p style={{ marginTop: '8px' }}>
              Enter the 6-digit code sent to<br/>
              <strong style={{ color: '#0f172a' }}>{email || "your email"}</strong>
            </p>
          </div>

          {/* 6-Digit Code */}
          <label className="auth-label" style={{ textAlign: 'center', marginBottom: '12px' }}>
            6-Digit Code
          </label>
          <div className="auth-code-wrapper" style={{ height: '60px', marginBottom: '24px' }}>
            <input 
              className="auth-code-input"
              placeholder="000000"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={handleKeyDown}
              style={{ fontSize: '30px', letterSpacing: '8px' }}
              autoFocus
            />
          </div>

          {/* New Password */}
          <div className="auth-input-group">
            <label className="auth-label">New Password</label>
            <div className="auth-input-wrapper">
              <LockIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="Enter new password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="auth-btn-icon" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="auth-input-group" style={{ marginBottom: '30px' }}>
            <label className="auth-label">Confirm New Password</label>
            <div className="auth-input-wrapper">
              <LockIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="Re-enter new password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <button
            className="auth-submit"
            onClick={handleResetPassword}
            disabled={isLoading || code.length < 6 || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'auth-spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
