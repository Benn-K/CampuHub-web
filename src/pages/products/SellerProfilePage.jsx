import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const LocationIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const StarIcon = ({ size = 16, color = '#F59E0B', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const ShieldCheckmarkIcon = ({ size = 16, color = '#10B981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const HeartIcon = ({ size = 18, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const CubeIcon = ({ size = 48, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export default function SellerProfilePage() {
  const storeProducts = useAppStore(s => s.products);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const wishlist = useAppStore(s => s.wishlist);
  
  const [activeTab, setActiveTab] = useState('sell'); // 'sell' | 'rent' | 'trade'

  // Parse seller ID from hash: #seller/s1
  const hash = window.location.hash;
  const match = hash.match(/^#seller\/(.+)$/);
  const sellerId = match ? match[1] : null;

  // Find products for this seller
  const sellerProducts = storeProducts.filter(p => p.sellerId === sellerId);
  const sampleProduct = sellerProducts[0];

  const profile = sampleProduct ? {
    first_name: sampleProduct.sellerName?.split(' ')[0] || 'Student',
    last_name: sampleProduct.sellerName?.split(' ')[1] || '',
    uni: 'Campus',
    is_verified: true,
    avatar_url: sampleProduct.sellerAvatar
  } : null;

  const products = sellerProducts.map(p => ({
    id: p.id,
    title: p.title,
    price: p.priceDisplay || `GH₵ ${p.price}`,
    condition: p.condition,
    type: p.type,
    image: p.images?.[0] || p.image
  }));

  const reviews = [];

  if (!profile) {
    return (
      <div className="prof-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#64748b', fontSize: 16 }}>Seller not found.</p>
        <a href="#home" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Home</a>
      </div>
    );
  }

  // Filter products
  const filteredProducts = products.filter(item => {
    let normalizedType = 'sell';
    if (item.type === 'FOR RENT') normalizedType = 'rent';
    if (item.type === 'FOR TRADE') normalizedType = 'trade';
    return normalizedType === activeTab;
  });

  const getBadgeStyle = (type) => {
    switch(type?.toUpperCase()) {
      case 'FOR RENT': return { bg: '#D8B4FE', text: '#581C87' }; 
      case 'FOR TRADE': return { bg: '#FDE047', text: '#854D0E' }; 
      case 'FOR SALE': return { bg: '#BFDBFE', text: '#1E3A8A' }; 
      default: return { bg: '#eee', text: '#333' };
    }
  };

  const sellerName = `${profile.first_name} ${profile.last_name || ''}`.trim();
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  return (
    <div className="seller-profile-page">
      {/* Header */}
      <div className="seller-header">
        <button className="seller-back-btn" onClick={() => window.history.back()}>
          <ArrowBackIcon color="#1A1F36" />
        </button>
        <h1 className="seller-header-title">Seller Profile</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="seller-content-scroll">
        <div className="seller-content-inner">
          
          {/* Profile Hero */}
          <div className="seller-hero">
            <img src={profile.avatar_url} alt={sellerName} className="seller-avatar" />
            <h2 className="seller-name">{sellerName}</h2>
            
            <div className="seller-meta-row">
              <div className="seller-meta-badge">
                <LocationIcon color="#005DE3" />
                <span className="seller-meta-text">{profile.uni || 'Campus'}</span>
              </div>
              <div className="seller-meta-badge">
                <StarIcon color="#F59E0B" />
                <span className="seller-meta-text">
                  {averageRating} {reviews.length > 0 ? `(${reviews.length} Reviews)` : ''}
                </span>
              </div>
            </div>
            
            <div className={`seller-verified-badge ${!profile.is_verified ? 'unverified' : ''}`}>
              {profile.is_verified && <ShieldCheckmarkIcon />}
              <span className="seller-verified-text">
                {profile.is_verified ? 'Verified Student' : 'Unverified Student'}
              </span>
            </div>
          </div>

          {/* 3-Way Tab */}
          <div className="seller-tab-container">
            {['sell', 'rent', 'trade'].map(tab => (
              <button 
                key={tab}
                className={`seller-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                For {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Listings */}
          <div className="seller-listings-section">
            <h3 className="seller-section-title">Active Listings</h3>
            
            {filteredProducts.length === 0 ? (
              <div className="seller-empty-state">
                <CubeIcon />
                <p>No items for {activeTab} right now.</p>
              </div>
            ) : (
              <div className="seller-grid">
                {filteredProducts.map(item => {
                  const badge = getBadgeStyle(item.type);
                  const isSaved = wishlist.includes(item.id);
                  return (
                    <div key={item.id} className="seller-grid-card" onClick={() => window.location.hash = '#product/' + item.id}>
                      <div className="seller-grid-img-wrap">
                        <img src={item.image} alt={item.title} className="seller-grid-img" />
                        <button
                          className="seller-product-save"
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                          style={{ opacity: isSaved ? 1 : undefined }}
                        >
                          <HeartIcon filled={isSaved} color={isSaved ? "#FF4757" : "#555"} />
                        </button>
                        <div className="seller-grid-badge" style={{ backgroundColor: badge.bg, color: badge.text }}>
                          {item.type}
                        </div>
                      </div>
                      <h4 className="seller-grid-title">{item.title}</h4>
                      <div className="seller-grid-meta">
                        <span className="seller-grid-price">{item.price}</span>
                        <span className="seller-grid-condition">{item.condition}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="seller-divider"></div>

          {/* Reviews */}
          <div className="seller-reviews-section">
            <h3 className="seller-section-title">Feedback & Ratings</h3>
            
            {reviews.length === 0 ? (
              <p className="seller-no-reviews">This seller has no feedback yet.</p>
            ) : (
              reviews.map((review, i) => (
                <div key={review.id} className={`seller-review-card ${i === reviews.length - 1 ? 'last' : ''}`}>
                  <div className="seller-review-user-row">
                    <img src={review.avatar} alt={review.name} className="seller-review-avatar" />
                    <div className="seller-review-info">
                      <span className="seller-review-name">{review.name}</span>
                      <div className="seller-review-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <StarIcon key={star} size={12} filled={star <= review.rating} />
                        ))}
                        <span className="seller-review-date">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="seller-review-text">{review.text}</p>
                </div>
              ))
            )}
            
            {reviews.length > 0 && (
              <button className="seller-see-all-btn" onClick={() => window.location.hash = '#reviews'}>
                View All Reviews
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
