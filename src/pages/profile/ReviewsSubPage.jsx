import React, { useState } from 'react';

// Icons based on the screenshot
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const StarIcon = ({ size = 20, color = "#F59E0B", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ShieldCheckIcon = ({ size = 24, color = "#10B981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} opacity="0.2"/>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 12 11 14 15 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// CSS mapping to match the mobile styling
const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%', fontFamily: 'sans-serif' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1F36', margin: 0 },
  
  content: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
  
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, display: 'flex', flexDirection: 'row', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: 20, border: '1px solid #F3F4F6' },
  summaryLeft: { flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #F3F4F6', paddingRight: 20 },
  scoreText: { fontSize: 48, fontWeight: '900', color: '#1A1F36', margin: '0 0 4px 0', lineHeight: 1 },
  starsRow: { display: 'flex', gap: 4, marginBottom: 8 },
  reviewsCount: { fontSize: 13, color: '#6B7280', margin: 0, fontWeight: '500' },
  
  summaryRight: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: 20 },
  shieldCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ECFDF5', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  trustedText: { fontSize: 14, color: '#10B981', fontWeight: '700', margin: 0 },

  tabsRow: { display: 'flex', gap: 10, marginBottom: 40 },
  tabActive: { backgroundColor: '#1A1F36', borderRadius: 20, padding: '8px 20px', color: '#fff', fontSize: 14, fontWeight: '600', border: 'none', cursor: 'pointer' },
  tabInactive: { backgroundColor: '#fff', borderRadius: 20, padding: '8px 20px', color: '#6B7280', fontSize: 14, fontWeight: '600', border: '1px solid #E5E7EB', cursor: 'pointer' },

  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1A1F36', marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

  reviewCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' },
  reviewerRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAEFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12, color: '#005DE3', fontWeight: '800', fontSize: 14 },
  reviewerName: { fontSize: 15, fontWeight: '700', color: '#1A1F36', margin: 0 },
  reviewDate: { fontSize: 12, color: '#9CA3AF', margin: 0, marginTop: 2 },
  reviewStarsRow: { display: 'flex', gap: 2, marginBottom: 10 },
  reviewText: { fontSize: 14, color: '#4B5563', lineHeight: '22px', margin: 0 }
};

export default function ReviewsSubPage() {
  const [activeTab, setActiveTab] = useState('All');

  const dummyReviews = [
    { id: 1, name: 'Alice M.', date: 'Oct 12, 2026', rating: 5, text: 'Great seller! The textbook was exactly as described and meetup was very smooth.' },
    { id: 2, name: 'David O.', date: 'Sep 28, 2026', rating: 5, text: 'Very communicative and friendly. Would definitely trade with them again.' },
    { id: 3, name: 'Sarah K.', date: 'Sep 15, 2026', rating: 4, text: 'Item was good, just a little late to the meetup point.' }
  ];

  const filteredReviews = dummyReviews.filter(r => {
    if (activeTab === '5 Star') return r.rating === 5;
    if (activeTab === 'Critical') return r.rating <= 3;
    return true;
  });

  const avgRating = 4.7;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={styles.headerTitle}>Reviews & Ratings</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.content}>
        
        {/* Top Summary Card */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryLeft}>
            <h1 style={styles.scoreText}>{avgRating.toFixed(1)}</h1>
            <div style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.round(avgRating)} />)}
            </div>
            <p style={styles.reviewsCount}>Based on {dummyReviews.length} reviews</p>
          </div>
          <div style={styles.summaryRight}>
            <div style={styles.shieldCircle}>
              <ShieldCheckIcon />
            </div>
            <p style={styles.trustedText}>Trusted Seller</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.tabsRow}>
          {['All', '5 Star', 'Critical'].map(tab => (
            <button 
              key={tab}
              style={activeTab === tab ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div style={styles.emptyState}>
            <StarIcon size={64} color="#D1D5DB" />
            <h3 style={styles.emptyTitle}>No reviews found</h3>
            <p style={styles.emptyDesc}>You don't have any reviews matching this filter.</p>
          </div>
        ) : (
          <div style={{ paddingBottom: 40 }}>
            {filteredReviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewerRow}>
                  <div style={styles.reviewerAvatar}>{review.name[0]}</div>
                  <div>
                    <p style={styles.reviewerName}>{review.name}</p>
                    <p style={styles.reviewDate}>{review.date}</p>
                  </div>
                </div>
                <div style={styles.reviewStarsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} size={14} color={i <= review.rating ? "#F59E0B" : "#D1D5DB"} filled={i <= review.rating} />
                  ))}
                </div>
                <p style={styles.reviewText}>{review.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
