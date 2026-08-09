import React, { useState } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';

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
  } else if (name === 'alert-circle') {
    iconContent = <><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></>;
  } else if (name === 'chevron-down') {
    iconContent = <><polyline points="6 9 12 15 18 9"></polyline></>;
  } else if (name === 'chevron-up') {
    iconContent = <><polyline points="18 15 12 9 6 15"></polyline></>;
  } else if (name === 'checkmark') {
    iconContent = <><polyline points="20 6 9 17 4 12"></polyline></>;
  } else if (name === 'at') {
    iconContent = <><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></>;
  } else if (name === 'warning') {
    iconContent = <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

const REPORT_TYPES = [
  'Scam or Fraud',
  'Counterfeit or Fake Item',
  'Inappropriate Content',
  'Harassment or Abuse',
  'Off-Platform Payment Request',
  'Other'
];

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  headerLeft: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  
  pageDesc: { fontSize: 14, color: '#6B7280', lineHeight: '22px', marginBottom: 15, margin: '0 0 15px 0' },
  warningBanner: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FEF2F2', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderStyle: 'solid', borderColor: '#FECACA' },
  warningText: { flex: 1, fontSize: 13, color: '#991B1B', lineHeight: '20px', fontWeight: '500', margin: 0 },
  
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  inputGroup: { marginBottom: 20, position: 'relative' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 10, margin: '0 0 10px 0' },
  
  dropdownSelector: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, paddingLeft: 15, paddingRight: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer', border: 'none', width: '100%' },
  dropdownText: { fontSize: 15, color: '#1A1F36', fontWeight: '500', margin: 0 },
  dropdownMenu: { position: 'absolute', top: 85, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', overflow: 'hidden', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  dropdownItem: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomStyle: 'solid', borderColor: '#F3F4F6', cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left' },
  dropdownItemText: { fontSize: 14, color: '#4B5563', fontWeight: '500', margin: 0 },
  
  inputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, paddingLeft: 15, paddingRight: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1F36', fontWeight: '500', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' },
  
  textAreaWrapper: { backgroundColor: '#F8F9FB', borderRadius: 16, padding: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', height: 120, display: 'flex' },
  textArea: { flex: 1, fontSize: 15, color: '#1A1F36', lineHeight: '22px', backgroundColor: 'transparent', border: 'none', outline: 'none', resize: 'none', width: '100%', fontFamily: 'inherit' },
  
  primaryBtn: { display: 'flex', flexDirection: 'row', backgroundColor: '#EF4444', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', border: 'none', width: '100%' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 }
};

export default function ReportSubPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  
  const [reportType, setReportType] = useState('Scam or Fraud');
  const [targetId, setTargetId] = useState('');
  const [description, setDescription] = useState('');
  
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!targetId.trim()) {
      window.alert("Missing Information\nPlease provide the Username or Listing Title you are reporting.");
      return;
    }
    if (description.length < 15) {
      window.alert("More Details Needed\nPlease provide a detailed description of the issue (at least 15 characters).");
      return;
    }

    if (!currentUser?.id) {
      window.alert("Error\nYou must be logged in to submit a report.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock Supabase call
      await new Promise(resolve => setTimeout(resolve, 800));

      window.alert("Report Submitted\nOur Trust & Safety team has received your report. We will investigate this immediately and take appropriate action.");
      router.push('/profile/menu');
    } catch (error) {
      window.alert(`Submission Failed\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A1F36" />
          </button>
          <p style={styles.headerTitle}>Report an Issue</p>
        </div>
      </div>

      <div style={styles.scrollContent}>
        
        <p style={styles.pageDesc}>
          Help keep the campus marketplace safe. We review every report carefully and keep your identity anonymous.
        </p>

        <div style={styles.warningBanner}>
          <Ionicons name="alert-circle" size={20} color="#B91C1C" style={{ marginRight: 10, marginTop: 2 }} />
          <p style={styles.warningText}>
            False reports violate our terms. Only use this form for genuine violations or scams.
          </p>
        </div>

        <div style={styles.formCard}>
          
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Reason for Report</p>
            <button style={{ ...styles.dropdownSelector, border: '1px solid #E5E7EB' }} onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
              <p style={styles.dropdownText}>{reportType}</p>
              <Ionicons name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </button>
            
            {showTypeDropdown && (
              <div style={styles.dropdownMenu}>
                {REPORT_TYPES.map((type, index) => (
                  <button 
                    key={index} 
                    style={{ ...styles.dropdownItem, ...(index === REPORT_TYPES.length - 1 ? { borderBottomWidth: 0 } : {}) }}
                    onClick={() => {
                      setReportType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <p style={{ ...styles.dropdownItemText, ...(reportType === type ? { color: '#EF4444', fontWeight: '800' } : {}) }}>{type}</p>
                    {reportType === type && <Ionicons name="checkmark" size={18} color="#EF4444" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Who or what are you reporting?</p>
            <div style={styles.inputWrapper}>
              <Ionicons name="at" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Username or Listing Title"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Details</p>
            <div style={styles.textAreaWrapper}>
              <textarea
                style={styles.textArea}
                placeholder="Please describe exactly what happened. Include dates, times, and any agreements made."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button 
            style={{ ...styles.primaryBtn, ...(isLoading ? { opacity: 0.7 } : {}) }} 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ color: '#fff' }}>Submitting...</span>
            ) : (
              <>
                <Ionicons name="warning" size={18} color="#fff" style={{ marginRight: 8 }} />
                <p style={styles.primaryBtnText}>Submit Report</p>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
