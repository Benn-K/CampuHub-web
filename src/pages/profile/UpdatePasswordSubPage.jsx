import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const LockIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const ShieldIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const EyeIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left' },
  scrollContent: { padding: '10px 20px 40px', overflowY: 'auto' },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6' },
  inputGroup: { marginBottom: 20, display: 'flex', flexDirection: 'column' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 10 },
  inputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, padding: '0 15px', border: '1px solid #E5E7EB' },
  inputIcon: { marginRight: 10, flexShrink: 0 },
  input: { flex: 1, fontSize: 15, color: '#1A1F36', fontWeight: '500', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginTop: 10, marginBottom: 25 },
  primaryButton: { backgroundColor: '#005DE3', height: 55, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', border: 'none' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 }
};

export default function UpdatePasswordSubPage() {
  const { showAlert, showConfirm } = useModal();
  const [currentEmail, setCurrentEmail] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentEmail(user.email);
    };
    fetchEmail();
  }, []);

  const handleSave = async () => {
    if (!password || !confirmPassword) {
      showAlert({ title: 'Missing Fields', message: 'Please fill out all password fields.', type: 'warning' });
      return;
    }
    if (password !== confirmPassword) {
      showAlert({ title: 'Password Mismatch', message: 'Your new passwords do not match.', type: 'warning' });
      return;
    }
    if (password.length < 6) {
      showAlert({ title: 'Weak Password', message: 'New password must be at least 6 characters.', type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;

      showAlert({ title: 'Success!', message: 'Your password has been updated securely.', type: 'success' });
      window.location.hash = '#profile';
    } catch (error) {
      showAlert({ title: 'Update Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!currentEmail) return;
    const confirmed = await showConfirm({
      title: 'Reset Password',
      message: `Send a reset link to ${currentEmail}?`,
      type: 'confirm',
      confirmText: 'Send Link'
    });
    
    if (confirmed) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(currentEmail);
        if (error) throw error;
        showAlert({ title: 'Link Sent', message: 'Check your email for the reset link.', type: 'success' });
      } catch (error) {
        showAlert({ title: 'Request Failed', message: error.message, type: 'error' });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={styles.headerTitle}>Change Password</p>
      </div>

      <div style={styles.scrollContent}>
        <div style={styles.formCard}>
          
          <div style={styles.inputGroup}>
            <button 
              onClick={handleForgotPassword} 
              style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span style={{ color: '#005DE3', fontSize: 13, fontWeight: '700' }}>Forgot your password? Send Reset Link</span>
            </button>
          </div>

          <div style={styles.divider} />

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>New Password</p>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><ShieldIcon /></div>
              <input 
                style={styles.input} 
                placeholder="Enter new password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Confirm New Password</p>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><ShieldIcon /></div>
              <input 
                style={styles.input} 
                placeholder="Re-enter your new password" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button 
            style={{ ...styles.primaryButton, ...(isLoading ? { opacity: 0.7 } : {}) }} 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? <span style={{ color: '#fff' }}>Updating...</span> : <p style={styles.primaryButtonText}>Update Password</p>}
          </button>
          
        </div>
      </div>
    </div>
  );
}
