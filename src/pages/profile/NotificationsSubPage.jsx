import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../components/modal/ModalContext';

// Mocking expo-router for Web
const router = {
  back: () => window.location.hash = '#profile',
  push: (route) => {
    if (typeof route === 'object' && route.pathname) {
      window.location.hash = `#${route.pathname.replace('/', '')}`;
    } else {
      window.location.hash = `#${route.replace('/', '')}`;
    }
  }
};

// Transforming Ionicons to SVG
const Ionicons = ({ name, size, color, style }) => {
  let iconContent = null;
  if (name === 'arrow-back') {
    iconContent = <><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></>;
  } else if (name === 'swap-horizontal') {
    iconContent = <><polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line></>;
  } else if (name === 'checkmark-done') {
    iconContent = <><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 10 13 19"></polyline></>;
  } else if (name === 'chatbubble-ellipses') {
    iconContent = <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="8" cy="10" r="1" fill="currentColor"></circle><circle cx="12" cy="10" r="1" fill="currentColor"></circle><circle cx="16" cy="10" r="1" fill="currentColor"></circle></>;
  } else if (name === 'shield-checkmark') {
    iconContent = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></>;
  } else if (name === 'mail') {
    iconContent = <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

// Web Toggle Switch Component
const ToggleSwitch = ({ isOn, handleToggle, disabled }) => {
  return (
    <div 
      onClick={!disabled ? handleToggle : undefined}
      style={{
        width: 44, height: 24, borderRadius: 12,
        backgroundColor: isOn ? '#005DE3' : '#D1D5DB',
        display: 'flex', alignItems: 'center',
        padding: 2, cursor: disabled ? 'not-allowed' : 'pointer', 
        transition: 'background-color 0.2s',
        boxSizing: 'border-box',
        opacity: disabled ? 0.6 : 1
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
  )
};

const DEFAULT_PREFERENCES = {
  newOffers: true,
  offerUpdates: true,
  newMessages: true,
  orderUpdates: true,
  emailAlerts: true,
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  headerLeft: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, overflowY: 'auto' },
  pageDescription: { fontSize: 14, color: '#6B7280', lineHeight: '20px', marginBottom: 25, margin: '0 0 25px 0' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 5px' },
  cardGroup: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', marginBottom: 25, borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  toggleRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomStyle: 'solid', borderColor: '#F3F4F6' },
  toggleIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15, flexShrink: 0 },
  toggleTextCol: { flex: 1, marginRight: 15 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: '#1A1F36', marginBottom: 2, margin: '0 0 2px 0' },
  toggleSubtitle: { fontSize: 12, color: '#6B7280', lineHeight: '16px', margin: 0 },
};

export default function NotificationsSubPage() {
  const currentUser = useAppStore(state => state.currentUser);
  const { showAlert } = useModal();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!currentUser?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', currentUser.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching preferences:', error);
        }
        
        if (data && data.notification_preferences) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...data.notification_preferences });
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchPreferences();
  }, [currentUser?.id]);

  const handleToggle = async (key, value) => {
    if (isSaving || isFetching || !currentUser?.id) return;
    
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: updatedPreferences })
        .eq('id', currentUser.id);
        
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Save error:', err);
      // Revert on error
      setPreferences(preferences);
      showAlert({ title: 'Update Failed', message: 'Could not save notification settings. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderToggleRow = (icon, title, subtitle, value, settingKey, isLast = false) => (
    <div style={{ ...styles.toggleRow, ...(isLast ? { borderBottomWidth: 0 } : {}) }}>
      <div style={styles.toggleIconBox}>
        <Ionicons name={icon} size={20} color="#4B5563" />
      </div>
      <div style={styles.toggleTextCol}>
        <p style={styles.toggleTitle}>{title}</p>
        <p style={styles.toggleSubtitle}>{subtitle}</p>
      </div>
      <ToggleSwitch 
        isOn={value} 
        handleToggle={() => handleToggle(settingKey, !value)}
        disabled={isFetching || isSaving}
      />
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A1F36" />
          </button>
          <p style={styles.headerTitle}>Notifications</p>
        </div>
      </div>

      <div style={styles.scrollContent}>
        
        <p style={styles.pageDescription}>
          Choose what alerts you want to receive to stay on top of your marketplace activity.
        </p>

        {/* Offers & Trades Section */}
        <p style={styles.sectionTitle}>Offers &amp; Trades</p>
        <div style={styles.cardGroup}>
          {renderToggleRow(
            'swap-horizontal', 
            'New Offers Received', 
            'When a user sends an offer you need to accept or decline.', 
            preferences.newOffers, 
            'newOffers'
          )}
          {renderToggleRow(
            'checkmark-done', 
            'Offer Status Updates', 
            'When a seller accepts or declines an offer you sent.', 
            preferences.offerUpdates, 
            'offerUpdates',
            true
          )}
        </div>

        {/* General App Activity Section */}
        <p style={styles.sectionTitle}>App Activity</p>
        <div style={styles.cardGroup}>
          {renderToggleRow(
            'chatbubble-ellipses', 
            'Direct Messages', 
            'When a buyer or seller sends you a new chat message.', 
            preferences.newMessages, 
            'newMessages'
          )}
          {renderToggleRow(
            'shield-checkmark', 
            'Escrow & Order Updates', 
            'When funds are locked, released, or an order is completed.', 
            preferences.orderUpdates, 
            'orderUpdates',
            true
          )}
        </div>

        {/* Email Preferences Section */}
        <p style={styles.sectionTitle}>Email Preferences</p>
        <div style={styles.cardGroup}>
          {renderToggleRow(
            'mail', 
            'Important Account Alerts', 
            'Receive emails for major account changes and security alerts.', 
            preferences.emailAlerts, 
            'emailAlerts',
            true
          )}
        </div>

      </div>
    </div>
  );
}
