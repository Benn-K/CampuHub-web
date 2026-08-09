import React, { useState } from 'react';
import './wishlist.css';

// Icons
const HeartIconFilled = ({ size = 20, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const HeartDislikeIcon = ({ size = 48, color = '#005DE3' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.23l-7.78-7.78a5.5 5.5 0 0 1 7.78-7.78L12 6.73l1.06-1.06a5.5 5.5 0 0 1 7.78 0 5.5 5.5 0 0 1 0 7.78l-1.06 1.06-3.89 3.89"></path>
    <line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>
);

const HomeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

import { useAppStore } from '../store';

export default function WishlistPage() {
  const wishlistIds = useAppStore((s) => s.wishlist);
  const products = useAppStore((s) => s.products);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);

  // Look up full product objects from the store
  const wishlist = products.filter((p) => wishlistIds.includes(p.id));

  const removeItem = (itemId) => {
    toggleWishlist(itemId);
  };



  const getBadgeStyle = (type) => {
    switch(type?.toUpperCase()) {
      case 'FOR RENT': return { bg: '#E0D4FF', text: '#6A0DAD' }; 
      case 'FOR TRADE': return { bg: '#D1FAE5', text: '#059669' }; 
      case 'FOR SALE': return { bg: '#DBEAFE', text: '#1D4ED8' }; 
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  return (
    <div className="wl-page-prof">
      <div className="wl-inner-prof">
        
        {/* ---- BREADCRUMB ---- */}
        <nav className="wl-breadcrumb-prof">
          <a href="#home" className="wl-breadcrumb-link-prof" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HomeIcon /> Home
          </a>
          <span className="wl-breadcrumb-sep-prof">›</span>
          <span className="wl-breadcrumb-current-prof">Saved Items</span>
        </nav>

        {/* ---- HEADER ---- */}
        <div className="wl-page-header-prof">
          <div>
            <h1 className="wl-page-title-prof">Saved Items</h1>
            <p className="wl-page-subtitle-prof">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
        </div>

        {/* ---- CONTENT ---- */}
        {wishlist.length === 0 ? (
          <div className="wl-empty-prof">
            <div className="wl-empty-icon-wrap-prof">
              <HeartDislikeIcon />
            </div>
            <h2 className="wl-empty-title-prof">No Saved Items Yet</h2>
            <p className="wl-empty-sub-prof">
              Keep track of textbooks, tech, and dorm essentials you want to buy or trade later.
            </p>
            <button className="wl-empty-btn-prof" onClick={() => window.location.hash = '#home'}>
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="wl-grid-prof">
            {wishlist.map(item => {
              const itemType = (item.type || 'FOR SALE').toUpperCase();
              const badgeConfig = getBadgeStyle(itemType);
              const itemPrice = item.priceDisplay || (typeof item.price === 'number' ? `GH₵ ${item.price.toFixed(2)}` : 'Trade');
              const itemImage = item.images?.[0] || item.image || 'https://via.placeholder.com/300';
              const itemLocation = item.location || 'Campus';

              return (
                <div key={item.id} className="wl-card-prof" onClick={() => window.location.hash = `#product/${item.id}`}>
                  
                  <div className="wl-card-image-wrap-prof">
                    <img src={itemImage} alt={item.title} className="wl-card-img-prof" />
                    <button className="wl-heart-btn-prof" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>
                      <HeartIconFilled />
                    </button>
                  </div>

                  <div className="wl-card-content-prof">
                    <div className="wl-card-meta-prof">
                      <span className="wl-badge-prof" style={{ backgroundColor: badgeConfig.bg, color: badgeConfig.text }}>
                        {itemType}
                      </span>
                      <span className="wl-condition-prof">{item.condition || 'Used'}</span>
                    </div>
                    
                    <h3 className="wl-card-title-prof">{item.title}</h3>
                    <p className="wl-card-location-prof">{itemLocation}</p>
                    
                    <div className="wl-card-footer-prof">
                      <span className="wl-card-price-prof">{itemPrice}</span>
                      <button className="wl-view-btn-prof" onClick={(e) => { e.stopPropagation(); window.location.hash = `#product/${item.id}`; }}>View Deal</button>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
