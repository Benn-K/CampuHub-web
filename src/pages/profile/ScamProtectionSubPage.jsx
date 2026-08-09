import React from 'react';
import { useModal } from '../../components/modal/ModalContext';

// Mocking expo-router for Web
const router = {
  back: () => window.history.back(),
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
  } else if (name === 'shield-half') {
    iconContent = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 2v20"></path></>;
  } else if (name === 'wallet') {
    iconContent = <><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></>;
  } else if (name === 'chatbubbles') {
    iconContent = <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></>;
  } else if (name === 'location') {
    iconContent = <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></>;
  } else if (name === 'checkmark-circle') {
    iconContent = <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"></circle><polyline points="8 12 11 15 16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></>;
  } else if (name === 'warning-outline') {
    iconContent = <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></>;
  } else if (name === 'flag') {
    iconContent = <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  
  heroContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, paddingLeft: 10, paddingRight: 10 },
  heroIconBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFFBEB', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#1A1F36', marginBottom: 8, margin: '0 0 8px 0' },
  heroSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '22px', margin: 0 },
  
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 15px 5px' },
  rulesContainer: { marginBottom: 25 },
  
  ruleCard: { display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  ruleIconBox: { width: 48, height: 48, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15, flexShrink: 0 },
  ruleTextCol: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  ruleTitle: { fontSize: 16, fontWeight: '800', color: '#1A1F36', marginBottom: 4, margin: '0 0 4px 0' },
  ruleDesc: { fontSize: 13, color: '#6B7280', lineHeight: '20px', margin: 0 },
  
  warningBanner: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 18, borderRadius: 20, marginBottom: 25, borderWidth: 1, borderStyle: 'solid', borderColor: '#FECACA' },
  warningTextCol: { flex: 1, marginLeft: 15 },
  warningTitle: { fontSize: 15, fontWeight: '800', color: '#991B1B', marginBottom: 4, margin: '0 0 4px 0' },
  warningSub: { fontSize: 13, color: '#B91C1C', lineHeight: '18px', margin: 0 },
  
  reportBtn: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF4444', paddingTop: 16, paddingBottom: 16, borderRadius: 16, boxShadow: '0 4px 8px rgba(239,68,68,0.2)', cursor: 'pointer', border: 'none', width: '100%' },
  reportBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', margin: 0 },
};

export default function ScamProtectionSubPage() {
  const handleReport = () => {
    if (window.confirm("Report Suspicious Activity\n\nIf someone is asking you to pay outside the app or acting suspiciously, let our Trust & Safety team know.\n\nClick OK to Report Issue.")) {
      router.push('/profile/report');
    }
  };

  const renderRuleCard = (icon, color, title, desc) => (
    <div style={styles.ruleCard}>
      <div style={{ ...styles.ruleIconBox, backgroundColor: `${color}15` }}>
        <Ionicons name={icon} size={24} color={color} />
      </div>
      <div style={styles.ruleTextCol}>
        <p style={styles.ruleTitle}>{title}</p>
        <p style={styles.ruleDesc}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>Scam Protection</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.scrollContent}>
        
        <div style={styles.heroContainer}>
          <div style={styles.heroIconBox}>
            <Ionicons name="shield-half" size={48} color="#F59E0B" />
          </div>
          <p style={styles.heroTitle}>Stay Safe on Campus</p>
          <p style={styles.heroSub}>
            CampuHub is built to protect students. Follow these golden rules to ensure you never lose your money or items.
          </p>
        </div>

        <p style={styles.sectionTitle}>The Golden Rules</p>
        
        <div style={styles.rulesContainer}>
          {renderRuleCard(
            'wallet', 
            '#10B981', 
            'Always Use Escrow', 
            'Never send MoMo directly to a seller. Always lock your funds in our Escrow system. We only release the money when you have the item in your hands.'
          )}
          
          {renderRuleCard(
            'chatbubbles', 
            '#005DE3', 
            'Keep Chats in the App', 
            'If a user insists on moving the conversation to WhatsApp or Telegram before the deal is locked, it is likely a scam. Stay on CampuHub.'
          )}
          
          {renderRuleCard(
            'location', 
            '#8B5CF6', 
            'Meet in Public Spaces', 
            'Always arrange meetups during the day in busy campus locations like the library, faculty blocks, or main cafeterias.'
          )}
          
          {renderRuleCard(
            'checkmark-circle', 
            '#F59E0B', 
            'Check for Verification', 
            'Trust users who have the green "Verified Student" badge. It means they have authenticated their university email address.'
          )}
        </div>

        <div style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={24} color="#B91C1C" />
          <div style={styles.warningTextCol}>
            <p style={styles.warningTitle}>Beware of Phishing Links</p>
            <p style={styles.warningSub}>CampuHub will never ask for your MoMo PIN or password in a chat. Do not click on external links sent by other users.</p>
          </div>
        </div>

        <button style={styles.reportBtn} onClick={handleReport}>
          <Ionicons name="flag" size={18} color="#fff" style={{ marginRight: 8 }} />
          <p style={styles.reportBtnText}>Report Suspicious Activity</p>
        </button>

      </div>
    </div>
  );
}
