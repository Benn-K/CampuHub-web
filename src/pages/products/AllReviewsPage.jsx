import React, { useState, useEffect } from 'react';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const StarIcon = ({ size = 16, color = '#F59E0B', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const StarOutlineIcon = ({ size = 48, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Amara K.', avatar: 'https://ui-avatars.com/api/?name=Amara+K&background=005DE3&color=fff', rating: 5, date: 'Oct 12, 2023', text: 'Great seller! The textbook was exactly as described. Fast communication and smooth handoff at the library.' },
  { id: 'r2', name: 'Ben W.', avatar: 'https://ui-avatars.com/api/?name=Ben+W&background=005DE3&color=fff', rating: 4, date: 'Sep 28, 2023', text: 'Good communication, smooth transaction. Would buy from again.' },
  { id: 'r3', name: 'Priya S.', avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=005DE3&color=fff', rating: 5, date: 'Sep 15, 2023', text: 'Item was in perfect condition. Very trustworthy seller.' },
  { id: 'r4', name: 'David M.', avatar: 'https://ui-avatars.com/api/?name=David+M&background=005DE3&color=fff', rating: 5, date: 'Aug 22, 2023', text: 'Highly recommend this seller. Extremely polite and punctual.' },
  { id: 'r5', name: 'Sarah L.', avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=005DE3&color=fff', rating: 4, date: 'Aug 05, 2023', text: 'Transaction went smoothly, no complaints. Item as described.' }
];

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setIsLoading(false);
    }, 300);
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';
    
  const averageStars = Math.round(Number(averageRating));

  if (isLoading) {
    return (
      <div className="reviews-loading">
        <div className="reviews-spinner"></div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-inner">
        
        {/* Header */}
        <div className="reviews-header">
          <button className="reviews-back-btn" onClick={() => window.history.back()}>
            <ArrowBackIcon color="#1A1F36" />
          </button>
          <h1 className="reviews-header-title">All Reviews</h1>
          <div style={{ width: 40 }}></div>
        </div>
        
        <div className="reviews-content">
          {reviews.length > 0 ? (
            <>
              {/* Summary Block */}
              <div className="reviews-summary-card">
                <span className="reviews-summary-score">{averageRating}</span>
                <div className="reviews-summary-right">
                  <div className="reviews-stars-row-summary">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarIcon key={i} size={22} filled={i <= averageStars} />
                    ))}
                  </div>
                  <span className="reviews-summary-count">Based on {reviews.length} verified ratings</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-user-row">
                      <img src={review.avatar} alt={review.name} className="review-avatar" />
                      <div className="review-user-info">
                        <span className="review-user-name">{review.name}</span>
                        <div className="review-stars-row">
                          {[1, 2, 3, 4, 5].map(i => (
                            <StarIcon key={i} size={14} filled={i <= review.rating} />
                          ))}
                          <span className="review-date">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="reviews-empty">
              <StarOutlineIcon color="#D1D5DB" />
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
