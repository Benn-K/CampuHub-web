import React from 'react';

// Icons
const GridIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const LibraryIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);
const LaptopIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const HeadsetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const GamingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4m10-2h.01M16 10h.01"/>
  </svg>
);
const ShirtIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46 16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
  </svg>
);
const BedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>
  </svg>
);
const BicycleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
  </svg>
);
const MusicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);
const ChevronRightIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const CATEGORIES = [
  { id: 'All', name: 'All Categories', icon: <GridIcon />, color: '#1A1F36', items: 248 },
  { id: 'Academics', name: 'Academics', icon: <LibraryIcon />, color: '#4378FF', items: 64 },
  { id: 'Computing', name: 'Computing & Accessories', icon: <LaptopIcon />, color: '#8B5CF6', items: 42 },
  { id: 'Phones', name: 'Phones & Accessories', icon: <PhoneIcon />, color: '#10B981', items: 38 },
  { id: 'Audio', name: 'Audio Devices', icon: <HeadsetIcon />, color: '#F59E0B', items: 21 },
  { id: 'Gaming', name: 'Gaming', icon: <GamingIcon />, color: '#EF4444', items: 19 },
  { id: 'Fashion', name: 'Fashion', icon: <ShirtIcon />, color: '#EC4899', items: 31 },
  { id: 'Hostel', name: 'Hostel Essentials', icon: <BedIcon />, color: '#0EA5E9', items: 15 },
  { id: 'Sports', name: 'Sports & Fitness', icon: <BicycleIcon />, color: '#14B8A6', items: 12 },
  { id: 'Music', name: 'Musical Instruments', icon: <MusicIcon />, color: '#F97316', items: 6 },
];

export default function CategoriesPage() {
  const handleCategorySelect = (categoryId) => {
    window.location.hash = '#category/' + encodeURIComponent(categoryId.toLowerCase());
  };

  return (
    <div className="cat-page">
      <div className="cat-inner">

        {/* Breadcrumb */}
        <nav className="cat-breadcrumb">
          <a href="#" className="cat-breadcrumb-link">Home</a>
          <span className="cat-breadcrumb-sep">›</span>
          <span className="cat-breadcrumb-current">Categories</span>
        </nav>

        {/* Header */}
        <div className="cat-header">
          <div>
            <h1 className="cat-title">Browse Categories</h1>
            <p className="cat-subtitle">Find exactly what you need across {CATEGORIES.length} categories</p>
          </div>
        </div>

        {/* Grid */}
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="cat-card"
              onClick={() => handleCategorySelect(cat.id)}
            >
              <div
                className="cat-card-icon"
                style={{ backgroundColor: `${cat.color}12`, color: cat.color }}
              >
                {cat.icon}
              </div>
              <div className="cat-card-info">
                <span className="cat-card-name">{cat.name}</span>
              </div>
              <ChevronRightIcon />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
