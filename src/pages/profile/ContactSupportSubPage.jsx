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
  } else if (name === 'mail') {
    iconContent = <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>;
  } else if (name === 'chevron-down') {
    iconContent = <><polyline points="6 9 12 15 18 9"></polyline></>;
  } else if (name === 'chevron-up') {
    iconContent = <><polyline points="18 15 12 9 6 15"></polyline></>;
  } else if (name === 'checkmark') {
    iconContent = <><polyline points="20 6 9 17 4 12"></polyline></>;
  } else if (name === 'send') {
    iconContent = <><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

const TOPICS = [
  'General Inquiry',
  'Issue with an Order/Escrow',
  'Account & Verification',
  'Report a Bug',
  'Feedback & Suggestions'
];

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  headerLeft: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: 15, cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },

  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  
  pageDesc: { fontSize: 14, color: '#6B7280', lineHeight: '22px', marginBottom: 20, margin: '0 0 20px 0' },

  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  
  inputGroup: { marginBottom: 20, position: 'relative' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 10, margin: '0 0 10px 0' },
  
  inputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, paddingLeft: 15, paddingRight: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB' },
  disabledInputWrapper: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1F36', fontWeight: '500', backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' },
  disabledInput: { color: '#9CA3AF' },

  dropdownSelector: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 16, height: 55, paddingLeft: 15, paddingRight: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer', border: 'none', width: '100%' },
  dropdownText: { fontSize: 15, color: '#1A1F36', fontWeight: '500', margin: 0 },
  dropdownMenu: { position: 'absolute', top: 85, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', overflow: 'hidden', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  dropdownItem: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomStyle: 'solid', borderColor: '#F3F4F6', cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left' },
  dropdownItemText: { fontSize: 14, color: '#4B5563', fontWeight: '500', margin: 0 },

  textAreaWrapper: { backgroundColor: '#F8F9FB', borderRadius: 16, padding: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', height: 150, display: 'flex' },
  textArea: { flex: 1, fontSize: 15, color: '#1A1F36', lineHeight: '22px', backgroundColor: 'transparent', border: 'none', outline: 'none', resize: 'none', width: '100%', fontFamily: 'inherit' },

  primaryBtn: { display: 'flex', flexDirection: 'row', backgroundColor: '#005DE3', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, cursor: 'pointer', border: 'none', width: '100%' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 }
};

export default function ContactSupportSubPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      window.alert("Missing Information\nPlease enter a message before sending.");
      return;
    }

    if (!currentUser?.id) {
      window.alert("Error\nYou must be logged in to contact support.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock Supabase call
      await new Promise(resolve => setTimeout(resolve, 800));

      window.alert("Message Sent!\nOur support team has received your request and will respond to your student email shortly.");
      router.push('/profile/menu');
      
    } catch (error) {
      console.error("Support Ticket Error:", error);
      window.alert("Failed to Send\nSomething went wrong sending your message. Please try again later.");
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
          <p style={styles.headerTitle}>Contact Support</p>
        </div>
      </div>

      <div style={styles.scrollContent}>
        
        <p style={styles.pageDesc}>
          Fill out the form below and our team will get back to you as soon as possible.
        </p>

        <div style={styles.formCard}>
          
          {/* Read-Only Email Field */}
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>From</p>
            <div style={{ ...styles.inputWrapper, ...styles.disabledInputWrapper }}>
              <Ionicons name="mail" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <input style={{ ...styles.input, ...styles.disabledInput }} value={'student@ug.edu.gh'} disabled />
            </div>
          </div>

          {/* Custom Topic Picker */}
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Topic</p>
            <button 
              style={styles.dropdownSelector} 
              onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            >
              <p style={styles.dropdownText}>{topic}</p>
              <Ionicons name={showTopicDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </button>
            
            {showTopicDropdown && (
              <div style={styles.dropdownMenu}>
                {TOPICS.map((t, index) => (
                  <button 
                    key={index} 
                    style={{ ...styles.dropdownItem, ...(index === TOPICS.length - 1 ? { borderBottomWidth: 0 } : {}) }}
                    onClick={() => {
                      setTopic(t);
                      setShowTopicDropdown(false);
                    }}
                  >
                    <p style={{ ...styles.dropdownItemText, ...(topic === t ? { color: '#005DE3', fontWeight: '800' } : {}) }}>{t}</p>
                    {topic === t && <Ionicons name="checkmark" size={18} color="#005DE3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Area */}
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>Message</p>
            <div style={styles.textAreaWrapper}>
              <textarea
                style={styles.textArea}
                placeholder="How can we help you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            style={{ ...styles.primaryBtn, ...(isLoading ? { opacity: 0.7 } : {}) }} 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ color: '#fff' }}>Sending...</span>
            ) : (
              <>
                <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
                <p style={styles.primaryBtnText}>Send Message</p>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
