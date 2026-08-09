import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const ShieldCheckmarkIcon = ({ size = 32, color = "#10B981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const ShieldHalfIcon = ({ size = 32, color = "#F59E0B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 2v20"></path>
  </svg>
);
const LockIcon = ({ size = 24, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="currentColor" stroke="none"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const MailIcon = ({ size = 20, color = "#005DE3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const PhoneIcon = ({ size = 20, color = "#4B5563" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);
const CheckmarkCircleIcon = ({ size = 24, color = "#10B981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"></circle><polyline points="8 12 11 15 16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
  </svg>
);

const ToggleSwitch = ({ isOn, handleToggle }) => (
  <div 
    onClick={handleToggle}
    style={{
      width: 44, height: 24, borderRadius: 12,
      backgroundColor: isOn ? '#10B981' : '#D1D5DB',
      display: 'flex', alignItems: 'center',
      padding: 2, cursor: 'pointer', transition: 'background-color 0.2s',
      boxSizing: 'border-box'
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: 10,
      backgroundColor: '#fff',
      transform: isOn ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 0.2s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }} />
  </div>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%', position: 'relative' },
  header: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left' },
  scrollContent: { padding: '10px 20px 40px', overflowY: 'auto' },
  statusBanner: { padding: 25, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 25, border: '1px solid' },
  statusBannerWarning: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
  statusBannerSecure: { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' },
  statusIconRing: { width: 72, height: 72, borderRadius: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  ringWarning: { backgroundColor: '#FEF3C7' },
  ringSecure: { backgroundColor: '#D1FAE5' },
  statusTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8, textAlign: 'center', margin: '0 0 8px 0' },
  textWarning: { color: '#D97706' },
  textSecure: { color: '#047857' },
  statusDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: '20px', padding: '0 10px', margin: 0 },
  masterToggleCard: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6' },
  toggleTextCol: { flex: 1, marginRight: 15 },
  toggleTitle: { fontSize: 16, fontWeight: '800', color: '#1A1F36', margin: '0 0 4px 0' },
  toggleSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: '18px', margin: 0 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 5px' },
  methodsContainer: { position: 'relative' },
  lockedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(248,249,251,0.5)', borderRadius: 20 },
  lockedText: { fontSize: 14, fontWeight: '700', color: '#6B7280', margin: 0 },
  cardGroup: { backgroundColor: '#fff', borderRadius: 20, padding: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6', transition: 'opacity 0.2s' },
  methodRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px 0', cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left' },
  iconBox: { width: 44, height: 44, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodTextCol: { flex: 1, marginRight: 15 },
  methodTitle: { fontSize: 15, fontWeight: '700', color: '#1A1F36', margin: '0 0 2px 0' },
  methodSubtitle: { fontSize: 13, color: '#6B7280', margin: 0 },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, border: '2px solid #D1D5DB', boxSizing: 'border-box' },
  divider: { height: 1, backgroundColor: '#F3F4F6', margin: '10px 0' },
};

export default function TwoFactorSubPage() {
  const currentUser = useAppStore(state => state.currentUser);
  const { showConfirm, showAlert } = useModal();
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [primaryMethod, setPrimaryMethod] = useState('email');
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentEmail(user.email);
      
      const { data } = await supabase.from('profiles').select('two_factor_enabled').eq('id', currentUser.id).single();
      if (data) setIs2FAEnabled(data.two_factor_enabled || false);
      
      setIsLoading(false);
    };
    fetchData();
  }, [currentUser?.id]);

  const update2FAState = async (newState) => {
    try {
      await supabase.from('profiles').update({ two_factor_enabled: newState }).eq('id', currentUser.id);
      setIs2FAEnabled(newState);
    } catch (err) {
      showAlert({ title: 'Error', message: 'Failed to update 2FA settings.', type: 'error' });
    }
  };

  const handleToggle2FA = async () => {
    if (!is2FAEnabled) {
      const confirmed = await showConfirm({
        title: 'Enable Two-Factor Authentication',
        message: 'We will send a 6-digit code to your student email to verify this setup.',
        confirmText: 'Enable',
        cancelText: 'Cancel'
      });
      if (confirmed) {
        showAlert({ title: 'Code Sent', message: 'Please check your email.', type: 'info' });
        update2FAState(true);
      }
    } else {
      const confirmed = await showConfirm({
        title: 'Disable Two-Factor Authentication?',
        message: 'This will make your account more vulnerable to unauthorized access.',
        confirmText: 'Disable',
        cancelText: 'Cancel',
        type: 'danger'
      });
      if (confirmed) {
        update2FAState(false);
      }
    }
  };

  const handleMethodSelect = (method) => {
    if (!is2FAEnabled) return;
    
    if (method === 'app') {
      showAlert({ title: 'Authenticator App', message: 'Coming soon! You will be able to link Google Authenticator or Authy.', type: 'info' });
    } else {
      setPrimaryMethod('email');
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={styles.headerTitle}>Two-Factor Auth</p>
      </div>

      <div style={styles.scrollContent}>
        <div style={{ ...styles.statusBanner, ...(is2FAEnabled ? styles.statusBannerSecure : styles.statusBannerWarning) }}>
          <div style={{ ...styles.statusIconRing, ...(is2FAEnabled ? styles.ringSecure : styles.ringWarning) }}>
            {is2FAEnabled ? <ShieldCheckmarkIcon /> : <ShieldHalfIcon />}
          </div>
          <p style={{ ...styles.statusTitle, ...(is2FAEnabled ? styles.textSecure : styles.textWarning) }}>
            {is2FAEnabled ? "Account is Highly Secure" : "Account Protection is Off"}
          </p>
          <p style={styles.statusDesc}>
            {is2FAEnabled 
              ? "Two-factor authentication is currently active. Your account is protected against unauthorized access." 
              : "Enable 2FA to require a verification code alongside your password when logging in."}
          </p>
        </div>

        <div style={styles.masterToggleCard}>
          <div style={styles.toggleTextCol}>
            <p style={styles.toggleTitle}>Two-Factor Authentication</p>
            <p style={styles.toggleSubtitle}>Require a code at login</p>
          </div>
          <ToggleSwitch isOn={is2FAEnabled} handleToggle={handleToggle2FA} />
        </div>

        <p style={styles.sectionTitle}>Verification Method</p>
        
        <div style={styles.methodsContainer}>
          {!is2FAEnabled && (
            <div style={styles.lockedOverlay}>
              <div style={{ marginBottom: 8 }}><LockIcon /></div>
              <p style={styles.lockedText}>Turn on 2FA to select a method</p>
            </div>
          )}

          <div style={{ ...styles.cardGroup, ...(!is2FAEnabled ? { opacity: 0.3, pointerEvents: 'none' } : {}) }}>
            <button 
              style={styles.methodRow} 
              onClick={() => handleMethodSelect('email')}
              disabled={!is2FAEnabled}
            >
              <div style={{ ...styles.iconBox, backgroundColor: '#EAEFFF' }}>
                <MailIcon />
              </div>
              <div style={styles.methodTextCol}>
                <p style={styles.methodTitle}>Student Email</p>
                <p style={styles.methodSubtitle}>{currentEmail || 'student@ug.edu.gh'}</p>
              </div>
              {primaryMethod === 'email' && is2FAEnabled ? <CheckmarkCircleIcon /> : <div style={styles.radioEmpty} />}
            </button>

            <div style={styles.divider} />

            <button 
              style={styles.methodRow} 
              onClick={() => handleMethodSelect('app')}
              disabled={!is2FAEnabled}
            >
              <div style={{ ...styles.iconBox, backgroundColor: '#F3F4F6' }}>
                <PhoneIcon />
              </div>
              <div style={styles.methodTextCol}>
                <p style={styles.methodTitle}>Authenticator App</p>
                <p style={styles.methodSubtitle}>Google Auth or Authy</p>
              </div>
              {primaryMethod === 'app' && is2FAEnabled ? <CheckmarkCircleIcon /> : <div style={styles.radioEmpty} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
