import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';

// Icons
const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ChevronDownIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CloseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);



const TX_TYPES = ['All', 'For Sale', 'For Rent', 'For Trade'];
const CONDITIONS = ['All', 'New', 'Like New', 'Used', 'Refurbished'];
const PRICE_RANGES = ['All Prices', 'Under GH₵50', 'GH₵50 - GH₵200', 'GH₵200+'];
const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low'];

export default function CategoryProductsPage({ categoryId }) {
  // Translate "all" to "All Categories" or capitalize ID
  const displayCategory = categoryId === 'all' ? 'All Categories' : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeCondition, setActiveCondition] = useState('All');
  const [activePrice, setActivePrice] = useState('All Prices');
  const [sortOrder, setSortOrder] = useState('Recommended');
  
  const [openDropdown, setOpenDropdown] = useState('none');
  
  const storeProducts = useAppStore((s) => s.products);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);

  const liveProducts = storeProducts.map(p => ({
    id: p.id,
    title: p.title,
    price: p.priceDisplay || `GH₵ ${p.price}`,
    type: p.type,
    condition: p.condition,
    location: p.location,
    image: p.images?.[0] || p.image,
    category: p.category
  }));

  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr.toUpperCase() === 'TRADE') return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  let filteredProducts = liveProducts.filter(item => {
    if (categoryId !== 'all' && item.category?.toLowerCase() !== categoryId.toLowerCase()) return false;
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'All' ? true : item.type === activeType.toUpperCase();
    const matchesCondition = activeCondition === 'All' ? true : item.condition.toUpperCase() === activeCondition.toUpperCase();
    
    let matchesPrice = true;
    const itemPrice = parsePrice(item.price);
    
    if (activePrice === 'Under GH₵50') {
      matchesPrice = itemPrice > 0 && itemPrice < 50; 
    } else if (activePrice === 'GH₵50 - GH₵200') {
      matchesPrice = itemPrice >= 50 && itemPrice <= 200;
    } else if (activePrice === 'GH₵200+') {
      matchesPrice = itemPrice > 200;
    }
    
    return matchesSearch && matchesType && matchesCondition && matchesPrice;
  });

  if (sortOrder === 'Price: Low to High') {
    filteredProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortOrder === 'Price: High to Low') {
    filteredProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  const getBadgeStyle = (type) => {
    switch(type) {
      case 'FOR RENT': return 'badge-rent'; 
      case 'FOR TRADE': return 'badge-trade'; 
      case 'FOR SALE': return 'badge-sale'; 
      default: return 'badge-default';
    }
  };

  const handleDropdownClick = (type) => {
    setOpenDropdown(openDropdown === type ? 'none' : type);
  };

  return (
    <div className="cat-prod-page">
      <div className="cat-prod-inner">
        {/* Breadcrumb */}
        <nav className="cat-breadcrumb">
          <a href="#" className="cat-breadcrumb-link">Home</a>
          <span className="cat-breadcrumb-sep">›</span>
          <a href="#categories" className="cat-breadcrumb-link">Categories</a>
          <span className="cat-breadcrumb-sep">›</span>
          <span className="cat-breadcrumb-current">{displayCategory}</span>
        </nav>

        {/* Header Section */}
        <div className="cat-prod-header-row">
          <div>
            <h1 className="cat-prod-title">{displayCategory}</h1>
            <p className="cat-prod-subtitle">{filteredProducts.length} items found</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="cat-prod-filters">
          <div className="cat-prod-search">
            <SearchIcon color="#9CA3AF" />
            <input 
              type="text" 
              placeholder={`Search in ${displayCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="cat-prod-search-clear">
                <CloseIcon color="#6B7280" />
              </button>
            )}
          </div>

          <div className="cat-prod-dropdowns">
            {/* Type Dropdown */}
            <div className="cat-prod-dropdown-wrap">
              <button 
                className={`cat-prod-filter-btn ${activeType !== 'All' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('type')}
              >
                {activeType === 'All' ? 'Type' : activeType}
                <ChevronDownIcon />
              </button>
              {openDropdown === 'type' && (
                <div className="cat-prod-dropdown-menu">
                  {TX_TYPES.map(type => (
                    <button 
                      key={type} 
                      className={`cat-prod-dropdown-item ${activeType === type ? 'selected' : ''}`}
                      onClick={() => { setActiveType(type); setOpenDropdown('none'); }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Condition Dropdown */}
            <div className="cat-prod-dropdown-wrap">
              <button 
                className={`cat-prod-filter-btn ${activeCondition !== 'All' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('cond')}
              >
                {activeCondition === 'All' ? 'Condition' : activeCondition}
                <ChevronDownIcon />
              </button>
              {openDropdown === 'cond' && (
                <div className="cat-prod-dropdown-menu">
                  {CONDITIONS.map(cond => (
                    <button 
                      key={cond} 
                      className={`cat-prod-dropdown-item ${activeCondition === cond ? 'selected' : ''}`}
                      onClick={() => { setActiveCondition(cond); setOpenDropdown('none'); }}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="cat-prod-dropdown-wrap">
              <button 
                className={`cat-prod-filter-btn ${activePrice !== 'All Prices' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('price')}
              >
                {activePrice === 'All Prices' ? 'Price' : activePrice}
                <ChevronDownIcon />
              </button>
              {openDropdown === 'price' && (
                <div className="cat-prod-dropdown-menu">
                  {PRICE_RANGES.map(price => (
                    <button 
                      key={price} 
                      className={`cat-prod-dropdown-item ${activePrice === price ? 'selected' : ''}`}
                      onClick={() => { setActivePrice(price); setOpenDropdown('none'); }}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <div className="cat-prod-dropdown-wrap cat-prod-sort-wrap">
              <button 
                className="cat-prod-filter-btn sort-btn"
                onClick={() => handleDropdownClick('sort')}
              >
                Sort: {sortOrder}
                <ChevronDownIcon />
              </button>
              {openDropdown === 'sort' && (
                <div className="cat-prod-dropdown-menu right-aligned">
                  {SORT_OPTIONS.map(opt => (
                    <button 
                      key={opt} 
                      className={`cat-prod-dropdown-item ${sortOrder === opt ? 'selected' : ''}`}
                      onClick={() => { setSortOrder(opt); setOpenDropdown('none'); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay to close dropdowns */}
        {openDropdown !== 'none' && (
          <div className="cat-prod-overlay" onClick={() => setOpenDropdown('none')}></div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="cat-prod-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="cat-prod-card">
                <div className="cat-prod-card-img-wrap">
                  <a href={`#product-${product.id}`}>
                    <img src={product.image} alt={product.title} loading="lazy" />
                  </a>
                  <span className={`cat-prod-badge ${getBadgeStyle(product.type)}`}>
                    {product.type}
                  </span>
                  <button 
                    className="cat-prod-save-btn" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                    style={{ opacity: wishlist.includes(product.id) ? 1 : undefined, zIndex: 10 }}
                  >
                    <HeartIcon filled={wishlist.includes(product.id)} />
                  </button>
                </div>
                <div className="cat-prod-card-info">
                  <a href={`#product-${product.id}`} className="cat-prod-card-title">{product.title}</a>
                  <div className="cat-prod-card-meta">
                    <span className="cat-prod-card-price">{product.price}</span>
                    <span className="cat-prod-card-condition">{product.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cat-prod-empty">
            <SearchIcon size={48} color="#D1D5DB" />
            <h3>No items found</h3>
            <p>We couldn't find any items matching your filters.</p>
            <button className="btn btn--primary" onClick={() => {
              setSearchQuery('');
              setActiveType('All');
              setActiveCondition('All');
              setActivePrice('All Prices');
            }}>Clear Filters</button>
          </div>
        )}

      </div>
    </div>
  );
}
