import React, { useState, useEffect } from 'react';

// Icons
const HeartIcon = ({ size = 20, color = '#1A1F36', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const ShieldCheckmarkIcon = ({ size = 16, color = '#005DE3' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const LocationIcon = ({ size = 16, color = '#6B7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const LockClosedIcon = ({ size = 16, color = '#0284C7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const SchoolIcon = ({ size = 16, color = '#D97706' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);
const StarIcon = ({ size = 16, color = '#F59E0B', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const ChatbubbleIcon = ({ size = 20, color = '#005DE3' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
const CartIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);
const TrashIcon = ({ size = 20, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const CalendarIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const SwapIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line>
  </svg>
);
const ThumbsUpIcon = ({ size = 14, color = '#0369A1' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);
const ShareIcon = ({ size = 18, color = '#6B7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const SAFE_LOCATIONS = [
  'Prempeh Library Hub',
  'Engineering Building Entrance'
];


import { useAppStore } from '../../store';

export default function ProductDetailsPage() {
  const [reviews] = useState([]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [locationType, setLocationType] = useState('verified');
  const [verifiedLocation, setVerifiedLocation] = useState(SAFE_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [cartFeedback, setCartFeedback] = useState('');

  // Store actions
  const addToCart = useAppStore((s) => s.addToCart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const isInCartFn = useAppStore((s) => s.isInCart);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  const getProductById = useAppStore((s) => s.getProductById);
  const products = useAppStore((s) => s.products);

  // Read product ID from URL hash: #product/p1 or #product?id=p1
  const hash = window.location.hash;
  const hashMatch = hash.match(/^#product\/(.+)$/);
  const queryMatch = hash.match(/[?&]id=([^&]+)/);
  const productId = hashMatch?.[1] || queryMatch?.[1];

  // Look up product from the store
  const product = productId ? getProductById(productId) : null;

  // Re-derive cart/wishlist state from store on every render
  const isInCart = product ? isInCartFn(product.id) : false;
  const isSaved = product ? wishlist.includes(product.id) : false;

  const handleCartToggle = () => {
    if (!product) return;
    if (isInCart) {
      removeFromCart(product.id);
      setCartFeedback('Removed from cart');
    } else {
      const finalLocation = locationType === 'verified' ? verifiedLocation : (customLocation.trim() || 'Negotiate in Chat');
      addToCart({ ...product, location: finalLocation });
      setCartFeedback('Added to cart!');
    }
    setTimeout(() => setCartFeedback(''), 2000);
  };

  const handleWishlistToggle = () => {
    if (product) toggleWishlist(product.id);
  };

  if (!product) {
    return (
      <div className="pdp-loading">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#64748b', fontSize: 16 }}>Product not found.</p>
          <a href="#home" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    );
  }



  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  const getBadgeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case 'FOR RENT': return { bg: '#EDE9FE', text: '#6D28D9', label: 'FOR RENT' };
      case 'FOR TRADE': return { bg: '#FEF3C7', text: '#92400E', label: 'FOR TRADE' };
      case 'FOR SALE': return { bg: '#DBEAFE', text: '#1E40AF', label: 'FOR SALE' };
      default: return { bg: '#F3F4F6', text: '#374151', label: type };
    }
  };

  const badge = getBadgeStyle(product.type);

  let primaryText = "Buy Now";
  let primaryIcon = <CartIcon />;
  let primaryColor = "#005DE3";

  if (product.type === 'FOR RENT') {
    primaryText = "Request to Rent";
    primaryIcon = <CalendarIcon />;
    primaryColor = "#6D28D9";
  } else if (product.type === 'FOR TRADE') {
    primaryText = "Offer a Trade";
    primaryIcon = <SwapIcon />;
    primaryColor = "#1A1F36";
  }

  return (
    <div className="pdp">
      <div className="pdp-inner">

        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <a href="#" className="pdp-breadcrumb-link">Home</a>
          <span className="pdp-breadcrumb-sep">›</span>
          <a href="#categories" className="pdp-breadcrumb-link">{product.category}</a>
          <span className="pdp-breadcrumb-sep">›</span>
          <span className="pdp-breadcrumb-current">{product.title}</span>
        </nav>

        {/* ===== TOP SECTION: Image + Info ===== */}
        <div className="pdp-main">

          {/* LEFT: Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-gallery-main">
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
                className="pdp-gallery-main-img"
              />
            </div>
            <div className="pdp-gallery-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImageIndex === i ? 'pdp-thumb-active' : ''}`}
                  onClick={() => setActiveImageIndex(i)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="pdp-thumb-img" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="pdp-info">
            <div className="pdp-info-top-row">
              <span className="pdp-badge" style={{ backgroundColor: badge.bg, color: badge.text }}>{badge.label}</span>
              <span className="pdp-posted">Posted {product.posted}</span>
            </div>

            <h1 className="pdp-title">{product.title}</h1>

            <div className="pdp-price-row">
              <span className="pdp-price">{product.priceDisplay || `GH₵ ${product.price}`}</span>
              <div className="pdp-condition-chip">
                <ThumbsUpIcon />
                <span>{product.condition}</span>
              </div>
            </div>

            <p className="pdp-desc">{product.description}</p>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button
                className="pdp-btn-primary"
                style={{ backgroundColor: primaryColor }}
                onClick={() => {
                  const finalLocation = locationType === 'verified' ? verifiedLocation : (customLocation.trim() || 'Negotiate in Chat');
                  window.location.hash = `#checkout?id=${product.id}&action=${product.type === 'FOR RENT' ? 'rent' : product.type === 'FOR TRADE' ? 'trade' : 'buy'}&location=${encodeURIComponent(finalLocation)}`;
                }}
              >
                {primaryIcon}
                <span>{primaryText}</span>
              </button>
              <div className="pdp-actions-secondary">
                <button
                  className={`pdp-btn-cart ${isInCart ? 'pdp-btn-cart-active' : ''}`}
                  onClick={handleCartToggle}
                >
                  {isInCart ? <TrashIcon size={18} /> : <CartIcon size={18} color="#005DE3" />}
                  <span>{isInCart ? 'Remove' : 'Add to Cart'}</span>
                </button>
                <button className="pdp-btn-icon" onClick={handleWishlistToggle} title="Save to Wishlist">
                  <HeartIcon size={20} filled={isSaved} color={isSaved ? '#EF4444' : '#6B7280'} />
                </button>
                <button className="pdp-btn-icon" title="Share" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <ShareIcon />
                </button>
              </div>
              {cartFeedback && (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                  ✓ {cartFeedback}
                </div>
              )}
            </div>

            <div className="pdp-separator" />

            {/* Seller Card */}
            <div className="pdp-seller-card">
              <img src={product.sellerAvatar} alt={product.sellerName} className="pdp-seller-avatar" />
              <div className="pdp-seller-details" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = '#seller/' + product.sellerId}>
                <span className="pdp-seller-name">{product.sellerName}</span>
                <div className="pdp-seller-meta">
                  {product.isVerified && <ShieldCheckmarkIcon size={14} color="#10B981" />}
                  <span className="pdp-seller-verified">
                    {product.isVerified ? `Verified · ${product.uni}` : 'Unverified'}
                  </span>
                </div>
              </div>
              <div className="pdp-seller-right">
                <div className="pdp-seller-rating">
                  <StarIcon size={14} />
                  <span>{averageRating}</span>
                </div>
                <button className="pdp-btn-chat" onClick={() => window.location.hash = `#chat?seller=${product.sellerId}&product=${product.id}`}>
                  <ChatbubbleIcon size={18} color="#005DE3" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            <div className="pdp-separator" />

            {/* Pickup Location */}
            <div className="pdp-pickup-section">
              <h3 className="pdp-section-heading">Pickup Location</h3>
              <div className="pdp-location-options">
                <button
                  className={`pdp-location-opt ${locationType === 'verified' ? 'pdp-location-opt-active' : ''}`}
                  onClick={() => setLocationType('verified')}
                >
                  <ShieldCheckmarkIcon size={16} color={locationType === 'verified' ? '#005DE3' : '#9CA3AF'} />
                  <span>Verified Safe Zone</span>
                  <div className="pdp-radio">{locationType === 'verified' && <div className="pdp-radio-dot" />}</div>
                </button>
                <button
                  className={`pdp-location-opt ${locationType === 'custom' ? 'pdp-location-opt-active' : ''}`}
                  onClick={() => setLocationType('custom')}
                >
                  <LocationIcon size={16} color={locationType === 'custom' ? '#005DE3' : '#9CA3AF'} />
                  <span>Alternate Location</span>
                  <div className="pdp-radio">{locationType === 'custom' && <div className="pdp-radio-dot" />}</div>
                </button>
              </div>

              {locationType === 'verified' && (
                <div className="pdp-location-pills">
                  {SAFE_LOCATIONS.map((loc, i) => (
                    <button
                      key={i}
                      className={`pdp-location-pill ${verifiedLocation === loc ? 'pdp-location-pill-active' : ''}`}
                      onClick={() => setVerifiedLocation(loc)}
                    >
                      <LocationIcon size={14} color={verifiedLocation === loc ? '#fff' : '#6B7280'} />
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}

              {locationType === 'custom' && (
                <div className="pdp-custom-location">
                  <input
                    type="text"
                    placeholder="e.g., Unity Hall entrance..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="pdp-custom-input"
                  />
                  <span className="pdp-custom-hint">Please ensure this location is safe and public.</span>
                </div>
              )}
            </div>

            {/* Trust Badges - compact inline */}
            <div className="pdp-trust-row">
              <div className="pdp-trust-badge">
                <LockClosedIcon size={14} color="#0284C7" />
                <span>Secure Escrow</span>
              </div>
              <div className="pdp-trust-badge">
                <SchoolIcon size={14} color="#D97706" />
                <span>Student-Only</span>
              </div>
              <div className="pdp-trust-badge">
                <ShieldCheckmarkIcon size={14} color="#10B981" />
                <span>ID Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM SECTION: Reviews ===== */}
        <div className="pdp-reviews-section">
          <div className="pdp-reviews-header">
            <div className="pdp-reviews-title-row">
              <h2 className="pdp-reviews-title">Seller Reviews</h2>
              <div className="pdp-reviews-summary-inline">
                <StarIcon size={18} />
                <span className="pdp-reviews-avg">{averageRating}</span>
                <span className="pdp-reviews-count">({reviews.length} reviews)</span>
              </div>
            </div>
            <button className="pdp-reviews-see-all" onClick={() => window.location.hash = '#reviews'}>See All Reviews</button>
          </div>

          <div className="pdp-reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="pdp-review-card">
                <div className="pdp-review-top">
                  <img src={review.avatar} alt={review.name} className="pdp-review-avatar" />
                  <div className="pdp-review-meta">
                    <span className="pdp-review-name">{review.name}</span>
                    <div className="pdp-review-stars-row">
                      {[1, 2, 3, 4, 5].map(i => (
                        <StarIcon key={i} size={12} filled={i <= review.rating} />
                      ))}
                      <span className="pdp-review-date">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="pdp-review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
