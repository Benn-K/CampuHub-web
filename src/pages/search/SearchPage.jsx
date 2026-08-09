import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';

// ===== ICONS =====
const SearchIcon = ({ size = 20, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CloseCircleIcon = ({ size = 20, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
const OptionsIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);
const TimeIcon = ({ size = 20, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const ArrowUpLeftIcon = ({ size = 18, color = "#D1D5DB" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>
  </svg>
);
const LocationIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const GlobeIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
const ChevronDownIcon = ({ size = 14, color = "#6B7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const HeartIcon = ({ size = 18, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const NavigateIcon = ({ size = 12, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);
const SearchOutlineLarge = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CheckmarkIcon = ({ size = 20, color = "#005DE3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const CloseIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TX_TYPES = ['All', 'For Sale', 'For Rent', 'For Trade'];
const CONDITIONS = ['All', 'New', 'Like New', 'Used', 'Refurbished'];
const PRICE_RANGES = ['All Prices', 'Under GH₵50', 'GH₵50 - GH₵200', 'GH₵200+']; 


export default function SearchPage() {
  const [submittedQuery, setSubmittedQuery] = useState('');
  
  const [locationScope, setLocationScope] = useState('Nearby');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('None');

  const [openDropdown, setOpenDropdown] = useState('none');
  const [activeType, setActiveType] = useState('All');
  const [activeCondition, setActiveCondition] = useState('All');
  const [activePrice, setActivePrice] = useState('All Prices');

  // Read from store
  const storeProducts = useAppStore((s) => s.products);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  
  const recentSearches = useAppStore((s) => s.recentSearches);
  const addRecentSearch = useAppStore((s) => s.addRecentSearch);
  const clearRecentSearches = useAppStore((s) => s.clearRecentSearches);
  const currentUser = useAppStore((s) => s.currentUser);
  const storeUserLocation = useAppStore((s) => s.userLocation);

  const displayLocation = storeUserLocation || (currentUser ? currentUser.uni : 'University of Ghana');

  // Map store products to the shape this page uses
  const liveProducts = storeProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.priceDisplay || `GH₵ ${p.price}`,
    condition: p.condition,
    type: p.type,
    location: p.location,
    image: p.images?.[0] || p.image,
  }));

  const [isLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const q = urlParams.get('q');
      if (q) {
        setSubmittedQuery(q);
        addRecentSearch(q);
      } else {
        setSubmittedQuery('');
      }
    };

    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm.trim()) return;
    window.location.hash = `#search?q=${encodeURIComponent(searchTerm)}`;
  };

  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr.toUpperCase() === 'TRADE') return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  let filteredProducts = liveProducts.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(submittedQuery.toLowerCase());
    const matchesType = activeType === 'All' ? true : item.type === activeType.toUpperCase();
    const matchesLocation = locationScope === 'Global' ? true : item.location === displayLocation;
    const matchesCondition = activeCondition === 'All' ? true : item.condition?.toUpperCase() === activeCondition.toUpperCase();
    
    let matchesPrice = true;
    const itemPrice = parsePrice(item.price);
    
    if (activePrice === 'Under GH₵50') {
      matchesPrice = itemPrice > 0 && itemPrice < 50; 
    } else if (activePrice === 'GH₵50 - GH₵200') {
      matchesPrice = itemPrice >= 50 && itemPrice <= 200;
    } else if (activePrice === 'GH₵200+') {
      matchesPrice = itemPrice > 200;
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesCondition && matchesPrice;
  });

  if (sortOrder === 'Asc') {
    filteredProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortOrder === 'Desc') {
    filteredProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  const getBadgeStyle = (type) => {
    switch(type?.toUpperCase()) {
      case 'FOR RENT': return { bg: '#E0D4FF', text: '#6A0DAD' }; 
      case 'FOR TRADE': return { bg: '#FFE4CC', text: '#D35400' }; 
      case 'FOR SALE': return { bg: '#D6E4FF', text: '#005DE3' }; 
      default: return { bg: '#eee', text: '#333' };
    }
  };

  const renderDropdownList = (options, activeState, setState) => (
    <div className="search-dropdown-menu">
      {options.map((option, index) => (
        <button 
          key={option} 
          className="search-dropdown-item"
          onClick={() => { setState(option); setOpenDropdown('none'); }}
        >
          <span style={{ color: activeState === option ? '#005DE3' : '#4B5563', fontWeight: activeState === option ? '800' : '600' }}>
            {option}
          </span>
          {activeState === option && <CheckmarkIcon size={18} />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="search-page-container">

      {!submittedQuery ? (
        /* Recent Searches */
        <div className="search-recent-container">
          <div className="search-recent-header">
            <h2 className="search-recent-title">Recent Searches</h2>
            {recentSearches.length > 0 && (
              <button className="search-clear-text" onClick={clearRecentSearches}>Clear All</button>
            )}
          </div>
          <div className="search-recent-list">
            {recentSearches.length === 0 ? (
              <p className="search-empty-recent">No recent searches</p>
            ) : (
              recentSearches.map((term, index) => (
                <button key={index} className="search-recent-item" onClick={() => handleSearchSubmit(term)}>
                  <TimeIcon size={20} color="#9CA3AF" />
                  <span className="search-recent-text">{term}</span>
                  <ArrowUpLeftIcon size={18} color="#D1D5DB" />
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Search Results & Filters */
        <div className="search-results-layout">
          
          {/* Filters Bar */}
          <div className="search-filters-wrapper">
            <div className="search-location-toggle">
              <button 
                className={`search-loc-btn ${locationScope === 'Nearby' ? 'active' : ''}`}
                onClick={() => setLocationScope('Nearby')}
              >
                <LocationIcon color={locationScope === 'Nearby' ? "#1A1F36" : "#6B7280"} />
                <span>Nearby ({displayLocation})</span>
              </button>
              <button 
                className={`search-loc-btn ${locationScope === 'Global' ? 'active' : ''}`}
                onClick={() => setLocationScope('Global')}
              >
                <GlobeIcon color={locationScope === 'Global' ? "#1A1F36" : "#6B7280"} />
                <span>Global</span>
              </button>
            </div>

            <div className="search-pills-row">
              <div className="search-pill-container">
                <button 
                  className={`search-filter-pill ${openDropdown === 'type' ? 'active' : ''} ${activeType !== 'All' ? 'selected' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'type' ? 'none' : 'type')}
                >
                  <span>{activeType === 'All' ? 'Type' : activeType}</span>
                  <ChevronDownIcon color={(openDropdown === 'type' || activeType !== 'All') ? "#005DE3" : "#6B7280"} />
                </button>
                {openDropdown === 'type' && renderDropdownList(TX_TYPES, activeType, setActiveType)}
              </div>
              
              <div className="search-pill-container">
                <button 
                  className={`search-filter-pill ${openDropdown === 'cond' ? 'active' : ''} ${activeCondition !== 'All' ? 'selected' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'cond' ? 'none' : 'cond')}
                >
                  <span>{activeCondition === 'All' ? 'Condition' : activeCondition}</span>
                  <ChevronDownIcon color={(openDropdown === 'cond' || activeCondition !== 'All') ? "#005DE3" : "#6B7280"} />
                </button>
                {openDropdown === 'cond' && renderDropdownList(CONDITIONS, activeCondition, setActiveCondition)}
              </div>

              <div className="search-pill-container">
                <button 
                  className={`search-filter-pill ${openDropdown === 'price' ? 'active' : ''} ${activePrice !== 'All Prices' ? 'selected' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'price' ? 'none' : 'price')}
                >
                  <span>{activePrice === 'All Prices' ? 'Price' : activePrice}</span>
                  <ChevronDownIcon color={(openDropdown === 'price' || activePrice !== 'All Prices') ? "#005DE3" : "#6B7280"} />
                </button>
                {openDropdown === 'price' && renderDropdownList(PRICE_RANGES, activePrice, setActivePrice)}
              </div>
            </div>

            <button 
              className="search-options-btn" 
              onClick={() => setIsFilterModalOpen(true)}
              style={{ borderColor: sortOrder !== 'None' ? '#005DE3' : '#F3F4F6', marginLeft: 'auto', width: 36, height: 36 }}
            >
              <OptionsIcon size={20} color={sortOrder !== 'None' ? "#005DE3" : "#1A1F36"} />
            </button>
          </div>

          {/* Results Content */}
          <div className="search-results-content" onClick={() => { if(openDropdown !== 'none') setOpenDropdown('none'); }}>
            {isLoading ? (
              <div className="search-loading">
                <div className="search-spinner"></div>
              </div>
            ) : (
              <>
                <div className="search-section-header">
                  <h3 className="search-section-title">Results for "{submittedQuery}"</h3>
                  <span className="search-section-subtitle">{filteredProducts.length} items found</span>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="search-grid">
                    {filteredProducts.map(item => {
                      const badge = getBadgeStyle(item.type);
                      const isSaved = wishlist.includes(item.id);
                      return (
                        <div key={item.id} className="search-grid-card" onClick={() => window.location.hash = '#product/' + item.id}>
                          <div className="search-grid-img-wrap">
                            <img src={item.image} alt={item.title} className="search-grid-img" />
                            <button 
                              className="search-heart-btn" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                toggleWishlist(item.id);
                              }}
                            >
                              <HeartIcon filled={isSaved} color={isSaved ? "#FF4757" : "#555"} />
                            </button>
                            <div className="search-grid-badge" style={{ backgroundColor: badge.bg, color: badge.text }}>
                              {item.type}
                            </div>
                          </div>
                          <h4 className="search-grid-title">{item.title}</h4>
                          <div className="search-grid-meta">
                            <span className="search-grid-price">{item.price}</span>
                            <span className="search-grid-condition">{item.condition}</span>
                          </div>
                          {locationScope === 'Global' && item.location !== displayLocation && (
                            <div className="search-remote-row">
                              <NavigateIcon color="#9CA3AF" />
                              <span className="search-remote-text">{item.location}</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="search-empty-state">
                    <SearchOutlineLarge />
                    <h4 className="search-empty-title">No matches found</h4>
                    <p className="search-empty-sub">Try adjusting your filters or switching to Global search!</p>
                  </div>
                )}
              </>
            )}
            
            {openDropdown !== 'none' && <div className="search-overlay-dim"></div>}
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {isFilterModalOpen && (
        <div className="search-modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
          <div className="search-modal-content" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3 className="search-modal-title">Sort Results</h3>
              <button className="search-modal-close" onClick={() => setIsFilterModalOpen(false)}>
                <CloseIcon size={24} color="#1A1F36" />
              </button>
            </div>
            <div className="search-modal-options">
              {[
                { label: 'Recommended (Default)', value: 'None' },
                { label: 'Price: Low to High', value: 'Asc' },
                { label: 'Price: High to Low', value: 'Desc' }
              ].map(opt => (
                <button 
                  key={opt.value} 
                  className="search-modal-option"
                  onClick={() => { setSortOrder(opt.value); setIsFilterModalOpen(false); }}
                >
                  <span style={{ color: sortOrder === opt.value ? '#005DE3' : '#4B5563', fontWeight: sortOrder === opt.value ? '800' : '600' }}>
                    {opt.label}
                  </span>
                  {sortOrder === opt.value && <CheckmarkIcon size={20} color="#005DE3" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
