import React, { useState } from 'react';

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
  } else if (name === 'search') {
    iconContent = <><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></>;
  } else if (name === 'close-circle') {
    iconContent = <><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></>;
  } else if (name === 'mail') {
    iconContent = <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>;
  } else if (name === 'chevron-forward') {
    iconContent = <><polyline points="9 18 15 12 9 6"></polyline></>;
  } else if (name === 'chevron-down') {
    iconContent = <><polyline points="6 9 12 15 18 9"></polyline></>;
  } else if (name === 'chevron-up') {
    iconContent = <><polyline points="18 15 12 9 6 15"></polyline></>;
  } else if (name === 'shield-half') {
    iconContent = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 2v20"></path></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

// MOCK DATA: Common Campus FAQs
const FAQS = [
  { id: '1', q: "How does the Escrow system work?", a: "When you buy an item, your money is locked safely in CampuHub's Escrow. It is only released to the seller after you meet up, inspect the item, and confirm the transaction in the app." },
  { id: '2', q: "How do I get the 'Verified Student' badge?", a: "You must link and verify your active university email address (e.g., name@st.knust.edu.gh). You can do this in your Account Settings." },
  { id: '3', q: "Are there any fees for selling?", a: "Listing items is 100% free! We only take a small 2% platform fee when a successful Escrow transaction is completed to cover MoMo transfer costs." },
  { id: '4', q: "What should I do if an item is not as described?", a: "Do not confirm the transaction! Tap 'Raise a Dispute' in the active deal page. Your funds will remain locked in Escrow while our Trust & Safety team investigates." },
  { id: '5', q: "How do I withdraw my earnings?", a: "Go to Profile > Escrow & Wallet, and tap 'Withdraw'. You can transfer your available balance directly to your linked MTN MoMo, Telecel Cash, or AT Money account." },
];

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0, flex: 1, textAlign: 'left', marginLeft: 15 },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  
  heroSection: { marginBottom: 25 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1A1F36', marginBottom: 15, margin: '0 0 15px 0' },
  searchContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, height: 55, paddingLeft: 15, paddingRight: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1F36', border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%' },
  clearSearchBtn: { padding: 5, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' },

  singleContactCard: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6', cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%' },
  singleContactIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ECFDF5', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  singleContactTextCol: { flex: 1 },
  contactTitle: { fontSize: 15, fontWeight: '800', color: '#1A1F36', marginBottom: 2, margin: '0 0 2px 0' },
  contactSub: { fontSize: 13, color: '#6B7280', margin: 0 },

  reportBtn: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 16, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderStyle: 'solid', borderColor: '#FEF3C7', cursor: 'pointer', width: '100%' },
  reportBtnText: { fontSize: 14, fontWeight: '800', color: '#D97706', margin: 0 },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 5px' },
  faqContainer: { backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6', overflow: 'hidden' },
  faqRow: { borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#F3F4F6' },
  faqHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left' },
  faqQuestion: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1A1F36', marginRight: 15, lineHeight: '22px', margin: 0 },
  faqBody: { paddingLeft: 18, paddingRight: 18, paddingBottom: 18, paddingTop: 0 },
  faqAnswer: { fontSize: 14, color: '#4B5563', lineHeight: '22px', margin: 0 },

  emptyState: { padding: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500', margin: 0 }
};

export default function HelpSubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>Help & Support</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.scrollContent}>
        
        {/* Hero Search Section */}
        <div style={styles.heroSection}>
          <p style={styles.heroTitle}>How can we help?</p>
          <div style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              placeholder="Search for articles or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 0 && (
              <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Support Button (Full Width) */}
        <button style={styles.singleContactCard} onClick={() => router.push('/profile/contact-support')}>
          <div style={styles.singleContactIconBox}>
            <Ionicons name="mail" size={24} color="#10B981" />
          </div>
          <div style={styles.singleContactTextCol}>
            <p style={styles.contactTitle}>Contact Support</p>
            <p style={styles.contactSub}>Send us a message for complex issues</p>
          </div>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </button>

        {/* Report an Issue Button - UPDATED ROUTE */}
        <button style={styles.reportBtn} onClick={() => router.push('/profile/report')}>
          <Ionicons name="shield-half" size={20} color="#F59E0B" style={{ marginRight: 10 }} />
          <p style={styles.reportBtnText}>Report a Scam or Suspicious User</p>
          <Ionicons name="chevron-forward" size={18} color="#F59E0B" style={{ marginLeft: 'auto' }} />
        </button>

        {/* Frequently Asked Questions */}
        <p style={styles.sectionTitle}>Frequently Asked Questions</p>
        
        <div style={styles.faqContainer}>
          {filteredFAQs.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No results found for &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              const isLast = index === filteredFAQs.length - 1;

              return (
                <div key={faq.id} style={{ ...styles.faqRow, ...(isLast ? { borderBottomWidth: 0 } : {}) }}>
                  <button 
                    style={styles.faqHeader} 
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <p style={{ ...styles.faqQuestion, ...(isExpanded ? { color: '#005DE3' } : {}) }}>{faq.q}</p>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={isExpanded ? "#005DE3" : "#9CA3AF"} 
                    />
                  </button>
                  
                  {isExpanded && (
                    <div style={styles.faqBody}>
                      <p style={styles.faqAnswer}>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  );
}
