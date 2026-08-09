import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const InfoIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="currentColor"></path>
  </svg>
);
const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left' },
  scrollContent: { padding: '10px 20px 40px', overflowY: 'auto' },
  infoBanner: { display: 'flex', flexDirection: 'row', backgroundColor: '#EAEFFF', padding: 15, borderRadius: 16, marginBottom: 20, border: '1px solid #BFDBFE' },
  infoText: { flex: 1, fontSize: 13, color: '#1E3A8A', lineHeight: '20px', fontWeight: '500', margin: 0 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6' },
  inputGroup: { marginBottom: 20, display: 'flex', flexDirection: 'column' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 10 },
  inputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, padding: '0 15px', border: '1px solid #E5E7EB' },
  inputIcon: { marginRight: 10, flexShrink: 0 },
  input: { flex: 1, fontSize: 15, color: '#1A1F36', fontWeight: '500', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' },
  primaryButton: { backgroundColor: '#005DE3', height: 55, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', border: 'none' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 }
};

export default function UpdateEmailSubPage() {
  const { showAlert } = useModal();
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentEmail(user.email);
    };
    fetchEmail();
  }, []);

  const handleSave = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      showAlert({ title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'warning' });
      return;
    }
    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      showAlert({ title: 'Notice', message: 'This is already your current email address.', type: 'info' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      
      showAlert({ title: 'Verification Links Sent', message: "For security, we've sent a verification link to both your old and new email addresses. Please check your inboxes to confirm the change.", type: 'success' });
      window.location.hash = '#profile';
    } catch (error) {
      showAlert({ title: 'Update Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={styles.headerTitle}>Change Email</p>
      </div>

      <div style={styles.scrollContent}>
        <div style={styles.infoBanner}>
          <div style={{ marginRight: 10 }}><InfoIcon color="#005DE3" /></div>
          <p style={styles.infoText}>You will need to verify the new email address before the change takes effect.</p>
        </div>

        <div style={styles.formCard}>
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Current Email</p>
            <div style={{ ...styles.inputWrapper, backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}>
              <div style={styles.inputIcon}><MailIcon color="#9CA3AF" /></div>
              <input style={{ ...styles.input, color: '#9CA3AF' }} value={currentEmail} disabled />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>New Student Email</p>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><MailIcon color="#888" /></div>
              <input 
                style={styles.input} 
                placeholder="name@st.knust.edu.gh" 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
              />
            </div>
          </div>

          <button 
            style={{ ...styles.primaryButton, ...(isLoading ? { opacity: 0.7 } : {}) }} 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? <span style={{ color: '#fff' }}>Requesting...</span> : <p style={styles.primaryButtonText}>Request Email Change</p>}
          </button>
        </div>
      </div>
    </div>
  );
}
