import React, { useState, useEffect } from 'react';

// Mocking expo-router for Web
const router = {
  back: () => window.history.back(),
};

// Transforming Ionicons to SVG
const Ionicons = ({ name, size, color, style }) => {
  let iconContent = null;
  if (name === 'arrow-back') {
    iconContent = <><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left' },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  
  lastUpdated: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', marginBottom: 20, fontStyle: 'italic', margin: '0 0 20px 0' },
  bodyText: { fontSize: 15, color: '#4B5563', lineHeight: '24px', margin: 0, whiteSpace: 'pre-wrap' },
  boldText: { fontWeight: '800', color: '#1A1F36', fontSize: 16 },
};

export default function LegalSubPage() {
  const [type, setType] = useState('privacy');

  // Read the type from the URL hash on mount and when it changes
  useEffect(() => {
    const checkHash = () => {
      const parts = window.location.hash.split('/');
      if (parts.length > 2) {
        setType(parts[2]);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>{title}</p>
      </div>

      <div style={styles.scrollContent}>
        <p style={styles.lastUpdated}>Last Updated: May 2026</p>
        
        {isPrivacy ? (
          <p style={styles.bodyText}>
            <span style={styles.boldText}>1. Information We Collect</span>{"\n"}
            We collect information you provide directly to us, such as your university email, name, and profile details when you create an account on CampuHub.{"\n\n"}
            <span style={styles.boldText}>2. How We Use Your Data</span>{"\n"}
            We use the information we collect to provide, maintain, and improve our marketplace, as well as to verify your student status.{"\n\n"}
            <span style={styles.boldText}>3. Sharing of Information</span>{"\n"}
            Your public profile and marketplace listings will be visible to other verified students on your campus. We do not sell your data to third parties.
          </p>
        ) : (
          <p style={styles.bodyText}>
            <span style={styles.boldText}>1. Acceptance of Terms</span>{"\n"}
            By accessing or using CampuHub, you agree to be bound by these Terms and our community guidelines.{"\n\n"}
            <span style={styles.boldText}>2. User Conduct</span>{"\n"}
            You agree not to post any fraudulent, illegal, or inappropriate items. CampuHub reserves the right to remove any listings or ban users who violate these rules.{"\n\n"}
            <span style={styles.boldText}>3. Transactions & Escrow</span>{"\n"}
            CampuHub acts as an intermediary for transactions. By using our Escrow service, you agree to our dispute resolution processes.
          </p>
        )}
      </div>
    </div>
  );
}
