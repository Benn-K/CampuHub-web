import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import './home.css';

import productBackpack from '../../assets/product-backpack.png';
import productTextbooks from '../../assets/product-textbooks.png';
import productLaptop from '../../assets/product-laptop.png';
import campusStudy from '../../assets/campus-study.png';
import campusEvent from '../../assets/campus-event.png';
import productToothbrush from '../../assets/product-toothbrush.png';

// ===== ICONS =====
const SearchIcon = ({ size = 18, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const LocationIcon = ({ size = 14, color = '#2563eb' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const ShieldIcon = ({ size = 12, color = '#2563eb' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const HeartIcon = ({ size = 16, color = '#94a3b8', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const StarIcon = ({ size = 11, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const ArrowRightIcon = ({ size = 14, color = '#1e3a8a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
const CashIcon = ({ size = 80, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

// Category icons
const LibraryIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>;
const LaptopIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>;
const BedIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 20h20"></path></svg>;
const ShirtIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6l-1 12h14l-1-12h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>;
const PhoneIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const GameIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="11" x2="15.01" y2="11"></line><line x1="18" y1="13" x2="18.01" y2="13"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path></svg>;

// Trust icons
const FastIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const LockIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const UsersIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

// MOCK DATA
const QUICK_CATEGORIES = [
  { id: 'Academics', name: 'Academics', icon: <LibraryIcon />, color: '#4378FF', bg: '#EFF4FF' },
  { id: 'Computing', name: 'Computing', icon: <LaptopIcon />, color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'Phones', name: 'Phones', icon: <PhoneIcon />, color: '#0EA5E9', bg: '#F0F9FF' },
  { id: 'Hostel', name: 'Hostel Ess.', icon: <BedIcon />, color: '#0EA5E9', bg: '#F0F9FF' },
  { id: 'Fashion', name: 'Fashion', icon: <ShirtIcon />, color: '#EC4899', bg: '#FDF2F8' },
  { id: 'Gaming', name: 'Gaming', icon: <GameIcon />, color: '#14B8A6', bg: '#F0FDFA' },
];


const TRUST_ITEMS = [
  {
    icon: <FastIcon />,
    color: '#2563eb',
    bg: '#eff6ff',
    title: 'Fast Campus Meetup',
    desc: 'Chat directly and meet on campus. No shipping, no waiting days.',
  },
  {
    icon: <LockIcon />,
    color: '#16a34a',
    bg: '#f0fdf4',
    title: 'Safe & Verified',
    desc: 'All sellers are verified students from your institution.',
  },
  {
    icon: <UsersIcon />,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: 'Campus Community',
    desc: 'Buy, sell, rent or trade exclusively within your campus.',
  },
];

// Flash Sale Countdown Hook
function useCountdown(endMs) {
  const [remaining, setRemaining] = useState(endMs - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(endMs - Date.now()), 1000);
    return () => clearInterval(id);
  }, [endMs]);
  const total = Math.max(0, remaining);
  const h = Math.floor(total / 3600000).toString().padStart(2, '0');
  const m = Math.floor((total % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((total % 60000) / 1000).toString().padStart(2, '0');
  return { h, m, s };
}

// Badge config
const getBadgeStyle = (type) => {
  switch (type?.toUpperCase()) {
    case 'FOR RENT':  return { bg: '#e0d4ff', text: '#6a0dad' };
    case 'FOR TRADE': return { bg: '#ffe4cc', text: '#d35400' };
    case 'FOR SALE':  return { bg: '#dbeafe', text: '#1d4ed8' };
    default:          return { bg: '#f1f5f9', text: '#475569' };
  }
};

const CAMPUS_COORDS = [
  { name: 'University of Ghana', lat: 5.6508, lng: -0.1869 },
  { name: 'KNUST', lat: 6.6731, lng: -1.5674 },
  { name: 'Ashesi University', lat: 5.7593, lng: -0.2223 },
  { name: 'UCC', lat: 5.1054, lng: -1.2829 },
  { name: 'Academic City', lat: 5.7314, lng: -0.1989 }
];

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const detectNearestCampus = (lat, lng) => {
  let closest = CAMPUS_COORDS[0];
  let minDistance = getDistance(lat, lng, closest.lat, closest.lng);
  for (let i = 1; i < CAMPUS_COORDS.length; i++) {
    const dist = getDistance(lat, lng, CAMPUS_COORDS[i].lat, CAMPUS_COORDS[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = CAMPUS_COORDS[i];
    }
  }
  return closest.name;
};

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Read from store
  const storeProducts = useAppStore((s) => s.products);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  const topSellers = useAppStore((s) => s.topSellers);
  const fetchProducts = useAppStore((s) => s.fetchProducts);
  const fetchTopSellers = useAppStore((s) => s.fetchTopSellers);
  
  const currentUser = useAppStore((s) => s.currentUser);
  const userLocation = useAppStore((s) => s.userLocation);
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const isLoadingProducts = useAppStore((s) => s.isLoadingProducts);

  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const displayLocation = userLocation || (currentUser ? currentUser.uni : 'University of Ghana');

  // Map store products to the shape this page uses
  const liveProducts = storeProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.priceDisplay || (String(p.price).includes('GH₵') ? p.price : `GH₵ ${p.price}`),
    condition: p.condition,
    type: p.type,
    location: p.location,
    image: p.images?.[0] || p.image,
    isNew: p.condition === 'New'
  }));

  // Flash sale ends in ~5.5 hours from mount
  const flashEndRef = useRef(Date.now() + 5.5 * 3600000 + 23 * 60000);
  const countdown = useCountdown(flashEndRef.current);

  useEffect(() => {
    fetchTopSellers();
    fetchProducts();
    
    if (!userLocation && !currentUser) {
      const t = setTimeout(() => setShowLocationPrompt(true), 1500);
      return () => clearTimeout(t);
    }
  }, [userLocation, currentUser]);

  const handleSelectLocation = (loc) => {
    setUserLocation(loc);
    setShowLocationPrompt(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    // Optional: show a loading state in the button if you want, but this is fast enough usually
    navigator.geolocation.getCurrentPosition((position) => {
      const nearest = detectNearestCampus(position.coords.latitude, position.coords.longitude);
      setUserLocation(nearest);
      setShowLocationPrompt(false);
    }, (err) => {
      console.error(err);
      alert("Could not detect location. Please select manually.");
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchProducts(), fetchTopSellers()]);
    setIsRefreshing(false);
  };

  const renderCard = (item) => {
    const badge = getBadgeStyle(item.type);
    const isSaved = wishlist.includes(item.id);
    return (
      <div 
        className="hp-card" 
        key={item.id} 
        style={{ cursor: 'pointer' }}
        onClick={() => window.location.hash = `#product/${item.id}`}
      >
        <div className="hp-card-img-wrap">
          <img src={item.image} alt={item.title} className="hp-card-img" />
          <span className="hp-card-badge" style={{ backgroundColor: badge.bg, color: badge.text }}>
            {item.type}
          </span>
          {item.isNew && <span className="hp-card-new-badge">NEW</span>}
          <button
            className="hp-card-heart"
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              toggleWishlist(item.id); 
            }}
            style={{ opacity: isSaved ? 1 : undefined, zIndex: 10 }}
          >
            <HeartIcon filled={isSaved} color={isSaved ? '#ef4444' : '#94a3b8'} />
          </button>
        </div>
        <div className="hp-card-body">
          <p className="hp-card-title">{item.title}</p>
          <div className="hp-card-meta">
            <span className="hp-card-price">{item.price}</span>
            <span className="hp-card-cond">{item.condition}</span>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="hp-card">
      <div className="hp-card-img-wrap hp-skeleton"></div>
      <div className="hp-card-body">
        <div className="hp-skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }}></div>
        <div className="hp-skeleton" style={{ height: 12, width: '45%', borderRadius: 4, marginTop: 6 }}></div>
      </div>
    </div>
  );

  return (
    <div className="hp-page">
      <div className="hp-inner">

        {/* ---- HERO ---- */}
        <div className="hp-hero">
          {/* Main hero card */}
          <div className="hp-hero-main">
            <div className="hp-hero-text">
              <span className="hp-hero-eyebrow">Campus Marketplace</span>
              <h1 className="hp-hero-title">Everything you need,<br />from people you trust.</h1>
              <p className="hp-hero-subtitle">Buy, sell, rent or trade with fellow students on your campus.</p>
              <a href="#search" className="hp-hero-cta">
                Explore Now <ArrowRightIcon />
              </a>
            </div>

          </div>

          {/* Side cards */}
          <div className="hp-hero-side">
            <a href="#search?q=rent" className="hp-hero-side-card hp-hero-side-card--rent">
              <span className="hp-hero-side-label">Explore</span>
              <p className="hp-hero-side-title">For Rent</p>
            </a>
            <a href="#search?q=trade" className="hp-hero-side-card hp-hero-side-card--trade">
              <span className="hp-hero-side-label">Looking to swap?</span>
              <p className="hp-hero-side-title">For Trade</p>
            </a>
          </div>
        </div>



        {/* ---- LOCATION ---- */}
        <div className="hp-location-row" style={{ marginBottom: 24 }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setShowLocationPrompt(true)}
          >
            <LocationIcon />
            <span className="hp-location-text">{displayLocation}</span>
            <span className="hp-location-sub">• Campus</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        {/* ---- QUICK CATEGORIES ---- */}
        <div className="hp-categories">
          {QUICK_CATEGORIES.map(cat => (
            <a href={`#category/${cat.id}`} className="hp-cat-item" key={cat.id}>
              <div className="hp-cat-icon" style={{ backgroundColor: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <span className="hp-cat-text">{cat.name}</span>
            </a>
          ))}
        </div>

        {/* ---- DYNAMIC CONTENT ---- */}
        {isLoadingProducts ? (
          <>
            <div className="hp-section-header">
              <div className="hp-skeleton" style={{ width: 140, height: 22, borderRadius: 6 }}></div>
            </div>
            <div className="hp-product-row">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : (
          <>
            {/* Campus Steals */}
            <div className="hp-section-header">
              <div className="hp-section-header-left">
                <span className="hp-section-tag">🔥 Hot</span>
                <h2 className="hp-section-title">Campus Steals</h2>
              </div>
              <a href="#search" className="hp-see-all">View All →</a>
            </div>
            <div className="hp-product-row">
              {liveProducts.slice(0, 5).map(renderCard)}
            </div>

            {/* Promo Banner */}
            <a href="#list" className="hp-promo-banner">
              <div className="hp-promo-content">
                <span className="hp-promo-eyebrow">Start Selling</span>
                <h2 className="hp-promo-title">Got stuff collecting dust?</h2>
                <p className="hp-promo-sub">Turn your old gear into cash or trade it for something you actually need.</p>
                <div className="hp-promo-btn">List an Item</div>
              </div>
              <div className="hp-promo-icon">
                <CashIcon size={180} color="#fff" />
              </div>
            </a>

            {/* Top Verified Sellers */}
            {topSellers.length > 0 && (
              <>
                <div className="hp-section-header">
                  <h2 className="hp-section-title">Top Verified Sellers</h2>
                </div>
                <div className="hp-sellers">
                  {topSellers.map(seller => (
                    <a href={`#seller/${seller.id}`} className="hp-seller-item" key={seller.id}>
                      <div className="hp-seller-avatar-wrap">
                        <img src={seller.avatar} alt={seller.name} className="hp-seller-avatar" />
                        {seller.isVerified && (
                          <div className="hp-seller-badge">
                            <ShieldIcon size={12} color="#2563eb" />
                          </div>
                        )}
                      </div>
                      <p className="hp-seller-name">{seller.name}</p>
                      <div className="hp-seller-rating">
                        <StarIcon /> {seller.rating}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Trending Near You */}
            <div className="hp-section-header">
              <div className="hp-section-header-left">
                <span className="hp-section-tag" style={{ background: '#2563eb' }}>Trending</span>
                <h2 className="hp-section-title">Near You</h2>
              </div>
              <a href="#search" className="hp-see-all">View All →</a>
            </div>
            <div className="hp-product-row">
              {liveProducts.slice(3, 8).map(renderCard)}
            </div>

            {/* How It Works trust strip */}
            <div className="hp-trust-strip">
              {TRUST_ITEMS.map((item, i) => (
                <div className="hp-trust-card" key={i}>
                  <div className="hp-trust-icon" style={{ background: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="hp-trust-card-title">{item.title}</p>
                    <p className="hp-trust-card-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fresh Listings grid */}
            <div className="hp-section-header">
              <div className="hp-section-header-left">
                <span className="hp-section-tag" style={{ background: '#16a34a' }}>New</span>
                <h2 className="hp-section-title">Fresh Listings</h2>
              </div>
              <a href="#search" className="hp-see-all">View All →</a>
            </div>
            <div className="hp-product-grid">
              {liveProducts.map(renderCard)}
            </div>
          </>
        )}

      </div>

      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ padding: '24px', textAlign: 'center' }}>
            <div className="modal-icon-wrap modal-icon--info" style={{ margin: '0 auto 16px' }}>
              <LocationIcon size={24} color="#2563eb" />
            </div>
            <h3 className="modal-title" style={{ marginBottom: '8px' }}>Where are you located?</h3>
            <p className="modal-message" style={{ marginBottom: '24px' }}>Select your campus to see items near you.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleUseCurrentLocation}
                style={{ 
                  padding: '12px', borderRadius: '8px', border: 'none', 
                  background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                Use Current Location
              </button>

              <div style={{ position: 'relative', textAlign: 'center', margin: '4px 0 14px' }}>
                <div style={{ borderTop: '1px solid #e2e8f0', position: 'absolute', top: '50%', width: '100%', zIndex: 1 }}></div>
                <span style={{ background: 'white', position: 'relative', zIndex: 2, padding: '0 10px', fontSize: '12px', color: '#64748b' }}>OR SELECT MANUALLY</span>
              </div>

              {['University of Ghana', 'KNUST', 'Ashesi University', 'UCC'].map(loc => (
                <button 
                  key={loc}
                  onClick={() => handleSelectLocation(loc)}
                  style={{ 
                    padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                    background: 'white', cursor: 'pointer', fontWeight: '500',
                    transition: 'all 0.2s', color: '#0f172a'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                >
                  {loc}
                </button>
              ))}
              <button 
                onClick={() => setShowLocationPrompt(false)}
                style={{ padding: '12px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '8px', fontWeight: '500' }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
