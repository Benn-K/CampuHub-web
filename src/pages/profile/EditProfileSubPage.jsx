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
const CallIcon = ({ size = 20, color = "#888" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const MailIcon = ({ size = 20, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const LockIcon = ({ size = 16, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const TrashIcon = ({ size = 18, color = "#EF4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  scrollContent: { padding: '0 20px 40px', overflowY: 'auto' },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6' },
  row: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  inputGroup: { marginBottom: 20, display: 'flex', flexDirection: 'column' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 10 },
  inputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, padding: '0 15px', border: '1px solid #E5E7EB' },
  disabledInputWrapper: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10, flexShrink: 0 },
  input: { flex: 1, fontSize: 15, color: '#1A1F36', fontWeight: '500', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' },
  disabledInput: { color: '#9CA3AF' },
  helperText: { fontSize: 12, color: '#6B7280', margin: '8px 0 0 0', fontWeight: '500' },
  primaryButton: { backgroundColor: '#005DE3', height: 55, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', border: 'none' },
  primaryButtonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 },
  dangerZone: { padding: 20, backgroundColor: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA' },
  dangerTitle: { fontSize: 16, fontWeight: '900', color: '#B91C1C', margin: '0 0 8px 0' },
  dangerDesc: { fontSize: 13, color: '#DC2626', lineHeight: '18px', margin: '0 0 15px 0' },
  deleteBtn: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '12px 0', borderRadius: 10, border: '1px solid #FECACA', cursor: 'pointer' },
  deleteBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '800', margin: 0, marginLeft: 8 }
};

export default function EditProfileSubPage() {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(s => s.logout);
  const { showAlert, showConfirm } = useModal();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) return;
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPhone(data.phone || '');
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentEmail(user.email || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [currentUser?.id]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showAlert({ title: 'Missing Info', message: 'First and Last name cannot be empty.', type: 'warning' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim()
      }).eq('id', currentUser.id);

      if (error) throw error;

      showAlert({ title: 'Success!', message: 'Your profile has been updated.', type: 'success' });
      // Update local store name (mocking a bit since the store needs to know)
      useAppStore.setState({
        currentUser: { ...currentUser, name: `${firstName.trim()} ${lastName.trim()}`, phone: phone.trim() }
      });
      window.location.hash = '#profile';
    } catch (error) {
      showAlert({ title: 'Update Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Account?',
      message: 'Are you absolutely sure? This action cannot be undone and you will lose all your listings, escrow balance, and chats.',
      type: 'danger',
      confirmText: 'Delete Account',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      await supabase.from('profiles').update({ is_deleted: true }).eq('id', currentUser?.id).catch(() => {});
      showAlert({ title: 'Account Scheduled for Deletion', message: 'Your account will be permanently removed within 24 hours.', type: 'info' });
      await supabase.auth.signOut();
      logout();
      window.location.hash = '#login';
    }
  };

  if (isFetching) {
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
        <p style={styles.headerTitle}>Edit Profile</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.scrollContent}>
        <div style={styles.formCard}>
          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1, marginRight: 10 }}>
              <p style={styles.inputLabel}>First Name</p>
              <div style={styles.inputWrapper}>
                <input 
                  style={styles.input} 
                  placeholder="Kwame" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <p style={styles.inputLabel}>Last Name</p>
              <div style={styles.inputWrapper}>
                <input 
                  style={styles.input} 
                  placeholder="Acheampong" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Phone Number</p>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><CallIcon /></div>
              <input 
                style={styles.input} 
                placeholder="(233) 123-456-789" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          {/* Read-Only Email Field */}
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Student Email</p>
            <div style={{ ...styles.inputWrapper, ...styles.disabledInputWrapper }}>
              <div style={styles.inputIcon}><MailIcon /></div>
              <input 
                style={{ ...styles.input, ...styles.disabledInput }} 
                value={currentEmail} 
                disabled 
              />
              <LockIcon />
            </div>
            <p style={styles.helperText}>To change your email, go to Privacy & Security.</p>
          </div>

          <button 
            style={{ ...styles.primaryButton, ...(isLoading ? styles.primaryButtonDisabled : {}) }} 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ color: '#fff' }}>Saving...</span>
            ) : (
              <p style={styles.primaryButtonText}>Save Changes</p>
            )}
          </button>
        </div>

        <div style={styles.dangerZone}>
          <p style={styles.dangerTitle}>Remove Account</p>
          <p style={styles.dangerDesc}>Once you delete your account, there is no going back. Please be certain.</p>
          <button style={styles.deleteBtn} onClick={handleDeleteAccount}>
            <TrashIcon />
            <p style={styles.deleteBtnText}>Delete Account</p>
          </button>
        </div>
      </div>
    </div>
  );
}
