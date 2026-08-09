import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../components/modal/ModalContext';
import './auth.css';

const router = {
  replace: (route) => {
    if (route === '/(tabs)/home') {
      window.location.hash = '#home';
    } else {
      window.location.hash = `#${route.replace('/', '')}`;
    }
  },
  push: (route) => {
    if (typeof route === 'object' && route.pathname) {
      const params = new URLSearchParams(route.params || {}).toString();
      window.location.hash = `#${route.pathname.replace(/^\/+/, '')}?${params}`;
    } else {
      window.location.hash = `#${route.replace(/^\/+/, '')}`;
    }
  }
};

// ===== ICONS =====
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const { showAlert, showConfirm } = useModal();

  const handleLogin = async () => {
    if (!email || !password) {
      await showAlert({ title: 'Missing Info', message: 'Please enter both your email and password.', type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const trimmedEmail = email.trim();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) throw error;

      const metadata = data.user.user_metadata || {};

      const userData = {
        id: data.user.id,
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Student',
        email: trimmedEmail,
        uni: trimmedEmail.split('@')[1]?.replace('.edu.gh', '').replace('st.', '').toUpperCase() || 'UNKNOWN',
        avatar: metadata.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.first_name || 'User')}&background=2563eb&color=fff`,
        trustScore: 5.0,
        earned: 0.00,
        escrowBalance: 0.00
      };

      setCurrentUser(userData);
      router.replace('/(tabs)/home');
    } catch (error) {
      await showAlert({ title: 'Login Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      await showAlert({ title: 'Email Required', message: 'Please enter your university email above first.', type: 'warning' });
      return;
    }
    const confirmed = await showConfirm({
      title: 'Reset Password',
      message: `Send a password reset link to ${trimmedEmail}?`,
      type: 'confirm',
      confirmText: 'Send Link',
    });
    if (confirmed) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/#auth/reset-password`,
        });
        if (error) throw error;
        await showAlert({ title: 'Link Sent!', message: 'Check your student email for the password reset link.', type: 'success' });
      } catch (error) {
        await showAlert({ title: 'Error', message: error.message, type: 'error' });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
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
          <h1 className="auth-title">Welcome<br />back.</h1>
          <p className="auth-subtitle">
            Log in to continue browsing deals, chatting with sellers, and managing your listings on campus.
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
        <div className="auth-card">

          {/* Card header - always visible */}
          <div className="auth-card-header">
            <div className="auth-brand-logo">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
                <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
                <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>
            <h2>Welcome back</h2>
            <p>Log in to your CampuHub account</p>
          </div>

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-label">University Email</label>
            <div className="auth-input-wrapper">
              <MailIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="name@st.knust.edu.gh"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <LockIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="auth-btn-icon" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button className="auth-forgot" onClick={handleForgotPassword}>
            Forgot Password?
          </button>

          <button
            className="auth-submit"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'auth-spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>

          <div className="auth-footer">
            <span>New to CampuHub?</span>
            <button className="auth-footer-link" onClick={() => router.push('/auth/signup')}>
              Create Account
            </button>
          </div>

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