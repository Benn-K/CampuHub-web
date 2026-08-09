import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const KeyIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);
const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const CallIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const RadioIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="currentColor"></circle>
  </svg>
);
const SchoolIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);
const DocumentIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const NewspaperIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path>
  </svg>
);
const ChevronRightIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ToggleSwitch = ({ isOn, handleToggle }) => (
  <div 
    onClick={handleToggle}
    style={{
      width: 44, height: 24, borderRadius: 12,
      backgroundColor: isOn ? '#005DE3' : '#D1D5DB',
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

const DEFAULT_PRIVACY = {
  showPhone: false,
  showOnlineStatus: true,
  campusOnlySearch: false,
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left' },
  scrollContent: { padding: '10px 20px 40px', overflowY: 'auto' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 5px' },
  cardGroup: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', marginBottom: 25, border: '1px solid #F3F4F6' },
  row: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, borderBottom: '1px solid #F3F4F6', cursor: 'pointer', background: 'none', width: '100%', textAlign: 'left', borderTop: 'none', borderLeft: 'none', borderRight: 'none' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15, flexShrink: 0 },
  textCol: { flex: 1, marginRight: 15 },
  title: { fontSize: 15, fontWeight: '700', color: '#1A1F36', margin: '0 0 2px 0' },
  subtitle: { fontSize: 12, color: '#6B7280', lineHeight: '16px', margin: 0 },
};

export default function PrivacySubPage() {
  const currentUser = useAppStore(s => s.currentUser);
  const [preferences, setPreferences] = useState(DEFAULT_PRIVACY);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!currentUser?.id) return;
      try {
        const { data } = await supabase.from('profiles').select('privacy_settings').eq('id', currentUser.id).single();
        if (data && data.privacy_settings) {
          setPreferences(prev => ({ ...prev, ...data.privacy_settings }));
        }
      } catch (err) {
        console.error('Error fetching privacy settings:', err);
      }
    };
    fetchPreferences();
  }, [currentUser?.id]);

  const handleToggle = async (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    
    if (currentUser?.id) {
      try {
        await supabase.from('profiles').update({ privacy_settings: updatedPreferences }).eq('id', currentUser.id);
      } catch (err) {
        console.error('Failed to update privacy settings:', err);
      }
    }
  };

  const renderToggleRow = (IconComponent, title, subtitle, value, onValueChange, isLast = false) => (
    <div style={{ ...styles.row, cursor: 'default', ...(isLast ? { borderBottomWidth: 0 } : {}) }}>
      <div style={styles.iconBox}>
        <IconComponent color="#4B5563" />
      </div>
      <div style={styles.textCol}>
        <p style={styles.title}>{title}</p>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
      <ToggleSwitch 
        isOn={value} 
        handleToggle={() => onValueChange(!value)} 
      />
    </div>
  );

  const renderActionRow = (IconComponent, title, subtitle, hash, isLast = false) => (
    <button style={{ ...styles.row, ...(isLast ? { borderBottomWidth: 0 } : {}) }} onClick={() => window.location.hash = hash}>
      <div style={styles.iconBox}>
        <IconComponent color="#4B5563" />
      </div>
      <div style={styles.textCol}>
        <p style={styles.title}>{title}</p>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
      <ChevronRightIcon color="#D1D5DB" />
    </button>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={styles.headerTitle}>Privacy & Security</p>
      </div>

      <div style={styles.scrollContent}>
        
        <p style={styles.sectionTitle}>Account Security</p>
        <div style={styles.cardGroup}>
          {renderActionRow(
            KeyIcon, 
            'Change Password', 
            'Update your current account password.', 
            '#profile/update-password'
          )}
          {renderActionRow(
            MailIcon, 
            'Change Email', 
            'Update the email address associated with your account.', 
            '#profile/update-email',
            true
          )}
        </div>

        <p style={styles.sectionTitle}>Privacy Preferences</p>
        <div style={styles.cardGroup}>
          {renderToggleRow(
            CallIcon, 
            'Show Phone Number', 
            'Allow verified buyers to see your phone number for MoMo or direct calls.', 
            preferences.showPhone, 
            (val) => handleToggle('showPhone', val)
          )}
          {renderToggleRow(
            RadioIcon, 
            'Show Online Status', 
            'Let others see when you are active on CampuHub.', 
            preferences.showOnlineStatus, 
            (val) => handleToggle('showOnlineStatus', val)
          )}
          {renderToggleRow(
            SchoolIcon, 
            'Campus-Only Visibility', 
            'Hide your profile and listings from Global Search. Only your campus can see them.', 
            preferences.campusOnlySearch, 
            (val) => handleToggle('campusOnlySearch', val), 
            true
          )}
        </div>

        <p style={styles.sectionTitle}>Legal & Policies</p>
        <div style={styles.cardGroup}>
          {renderActionRow(
            DocumentIcon, 
            'Privacy Policy', 
            'Read how we collect, use, and protect your data.', 
            '#profile/legal'
          )}
          {renderActionRow(
            NewspaperIcon, 
            'Terms & Conditions', 
            'Review our rules and community guidelines.', 
            '#profile/legal',
            true
          )}
        </div>

      </div>
    </div>
  );
}
