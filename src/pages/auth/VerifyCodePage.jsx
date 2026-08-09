import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../components/modal/ModalContext';
import './auth.css';

// ===== ICONS =====
const MailIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#005DE3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CampuHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
    <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
    <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.6)" />
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
  },
  back: () => {
    window.history.back();
  }
};

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
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

  // Timer effect for resend code
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (code.length < 6) {
      await showAlert({ title: 'Invalid Code', message: 'Please enter the full 6-digit verification code.', type: 'warning' });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'signup'
      });

      if (error) throw error;

      if (data.user) {
        const userData = {
          id: data.user.id,
          name: `${data.user.user_metadata?.first_name || ''} ${data.user.user_metadata?.last_name || ''}`.trim() || 'Student',
          email: data.user.email,
          uni: email.split('@')[1]?.replace('.edu.gh', '').replace('st.', '').toUpperCase() || 'UNKNOWN',
          avatar: data.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=S&background=2563eb&color=fff`,
          trustScore: data.user.user_metadata?.trust_score || 5.0,
          earned: data.user.user_metadata?.earned || 0.00,
          escrowBalance: data.user.user_metadata?.escrow_balance || 0.00
        };

        setCurrentUser(userData);
        router.replace('/(tabs)/home');
      }

    } catch (error) {
      await showAlert({ title: 'Verification Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return; // Prevent clicking while timer is active

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      if (error) throw error;
      await showAlert({ title: 'Code Sent!', message: 'A new verification code has been sent to your email.', type: 'success' });
      setResendTimer(60);
    } catch (error) {
      await showAlert({ title: 'Error', message: error.message, type: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleVerify();
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
          <h1 className="auth-title">Verify<br />account.</h1>
          <p className="auth-subtitle">
            Please check your student email for the verification code we just sent you.
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
          
          <div className="auth-card-header" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '40px', 
                backgroundColor: '#f1f5f9', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
              }}>
                <MailIcon />
              </div>
            </div>
            <h2>Check your email</h2>
            <p>
              We sent a verification code to:<br/>
              <strong style={{ color: '#0f172a' }}>{email || "your student email"}</strong>
            </p>
          </div>

          <label className="auth-label" style={{ textAlign: 'center', marginBottom: '12px', fontSize: '15px' }}>
            Enter 6-Digit Code
          </label>
          
          <div className="auth-code-wrapper">
            <input 
              className="auth-code-input"
              placeholder="000000"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <button
            className="auth-submit"
            onClick={handleVerify}
            disabled={isLoading || code.length < 6}
            style={{ marginTop: '20px' }}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'auth-spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>

          <div className="auth-footer" style={{ marginTop: '30px' }}>
            <span>Didn't receive the email? </span>
            <button 
              className="auth-footer-link" 
              onClick={handleResend} 
              disabled={resendTimer > 0}
              style={{ color: resendTimer > 0 ? '#94a3b8' : '#2563eb', cursor: resendTimer > 0 ? 'default' : 'pointer', textDecoration: resendTimer > 0 ? 'none' : '' }}
            >
              {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
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
