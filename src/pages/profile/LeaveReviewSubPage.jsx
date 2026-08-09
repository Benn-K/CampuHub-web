import React, { useState } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';

// Mocking expo-router for Web
const router = {
  back: () => window.history.back()
};

// Transforming Ionicons to SVG
const Ionicons = ({ name, size, color, style }) => {
  let iconContent = null;
  if (name === 'arrow-back') {
    iconContent = <><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></>;
  } else if (name === 'cube-outline') {
    iconContent = <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>;
  } else if (name === 'star') {
    iconContent = <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></>;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
        {iconContent}
      </svg>
    );
  } else if (name === 'star-outline') {
    iconContent = <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></>;
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0 },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40, paddingTop: 10, overflowY: 'auto' },
  contextBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EAEFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  contextTitle: { fontSize: 22, fontWeight: '900', color: '#1A1F36', marginBottom: 8, margin: 0 },
  contextSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '22px', paddingLeft: 20, paddingRight: 20, margin: 0 },
  starsContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 10 },
  starBtn: { padding: 5, background: 'none', border: 'none', cursor: 'pointer' },
  ratingLabel: { textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#F59E0B', marginBottom: 30, margin: 0 },
  inputContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6', marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 15, margin: 0 },
  textInput: { fontSize: 15, color: '#1A1F36', minHeight: 120, lineHeight: '22px', width: '100%', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  charCount: { textAlign: 'right', fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 10, margin: 0 },
  submitBtn: { backgroundColor: '#005DE3', borderRadius: 16, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 93, 227, 0.2)', cursor: 'pointer', border: 'none', width: '100%' },
  submitBtnDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', margin: 0 },
};

export default function LeaveReviewSubPage() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const sellerId = urlParams.get('sellerId');
  const sellerName = urlParams.get('sellerName');
  const productId = urlParams.get('productId');
  const itemName = urlParams.get('itemName');

  const user = useAppStore((state) => state.currentUser);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      window.alert("Empty Review\nPlease write a few words about your experience.");
      return;
    }

    if (!user?.id || !sellerId) {
      window.alert("Error\nMissing user or seller information.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock Supabase call
      await new Promise(resolve => setTimeout(resolve, 800));

      window.alert("Review Posted!\nThank you for helping keep the CampuHub community safe and reliable.");
      router.back();

    } catch (error) {
      console.error("Error posting review:", error);
      window.alert("Submission Failed\nCould not post your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>Leave a Review</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.scrollContent}>
        
        <div style={styles.contextBox}>
          <div style={styles.iconCircle}>
            <Ionicons name="cube-outline" size={24} color="#005DE3" />
          </div>
          <p style={styles.contextTitle}>How was your experience?</p>
          <p style={styles.contextSub}>
            Rate your transaction for <span style={{ fontWeight: '800', color: '#1A1F36' }}>{itemName || 'this item'}</span> with <span style={{ fontWeight: '800', color: '#1A1F36' }}>{sellerName || 'this seller'}</span>.
          </p>
        </div>

        <div style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} style={styles.starBtn}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={42} 
                color={star <= rating ? "#F59E0B" : "#D1D5DB"} 
              />
            </button>
          ))}
        </div>
        <p style={styles.ratingLabel}>
          {rating === 5 ? "Excellent!" : rating === 4 ? "Good" : rating === 3 ? "Okay" : rating === 2 ? "Poor" : "Terrible"}
        </p>

        <div style={styles.inputContainer}>
          <p style={styles.inputLabel}>Write your review</p>
          <textarea
            style={styles.textInput}
            placeholder="Was the item as described? Was the seller on time?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={300}
          />
          <p style={styles.charCount}>{reviewText.length}/300</p>
        </div>

        <button 
          style={{ ...styles.submitBtn, ...(isSubmitting ? styles.submitBtnDisabled : {}) }} 
          onClick={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={{ color: '#fff' }}>Posting...</span>
          ) : (
            <p style={styles.submitBtnText}>Post Review</p>
          )}
        </button>

      </div>
    </div>
  );
}
