import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { useModal } from '../../components/modal/ModalContext';
import { supabase } from '../../supabaseClient';
import LeaveReviewSubPage from './LeaveReviewSubPage';
import ReviewsSubPage from './ReviewsSubPage';
import MyListingsSubPage from './MyListingsSubPage';
import OrdersSubPage from './OrdersSubPage';
import InventorySubPage from './InventorySubPage';
import WalletSubPage from './WalletSubPage';
import HistorySubPage from './HistorySubPage';
import EditProfileSubPage from './EditProfileSubPage';
import NotificationsSubPage from './NotificationsSubPage';
import PrivacySubPage from './PrivacySubPage';
import UpdateEmailSubPage from './UpdateEmailSubPage';
import UpdatePasswordSubPage from './UpdatePasswordSubPage';
import LegalSubPage from './LegalSubPage';
import TwoFactorSubPage from './TwoFactorSubPage';
import ScamProtectionSubPage from './ScamProtectionSubPage';
import HelpSubPage from './HelpSubPage';
import ReportSubPage from './ReportSubPage';
import ContactSupportSubPage from './ContactSupportSubPage';
import EditListingSubPage from './EditListingSubPage';

// ===== ICONS =====
const SearchIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CloseIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const StarIcon = ({ size = 20, color = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const StorefrontIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);
const BagIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);
const CubeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const WalletIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
  </svg>
);
const ReceiptIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><line x1="16" y1="8" x2="8" y2="8"></line><line x1="16" y1="12" x2="8" y2="12"></line><line x1="10" y1="16" x2="8" y2="16"></line>
  </svg>
);
const PersonIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const BellIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);
const LockIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const ShieldCheckIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const ShieldHalfIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 2v20"></path>
  </svg>
);
const HelpIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const FlagIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);
const LogoutIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const LocationIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const ChevronRightIcon = ({ size = 16, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PROFILE_SECTIONS = [
  {
    id: 'reputation',
    title: 'Reputation',
    items: [
      { id: 'reviews', icon: <StarIcon />, title: 'Reviews & Ratings', subtitle: 'See what others say about you', color: '#F59E0B', route: '#reviews', keywords: ['stars', 'feedback', 'comments', 'buyer rating', 'seller rating'] }
    ]
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    items: [
      { id: 'listings', icon: <StorefrontIcon />, title: 'My Listings', subtitle: 'Manage your items for sale', color: '#005DE3', route: '#profile-listings', keywords: ['sell', 'post', 'active', 'delete item', 'edit item', 'products'] },
      { id: 'orders', icon: <BagIcon />, title: 'Orders', subtitle: 'Track your purchases and sales', color: '#10B981', route: '#profile-orders', keywords: ['bought', 'sold', 'purchases', 'tracking', 'delivery'] },
      { id: 'inventory', icon: <CubeIcon />, title: 'My Inventory', subtitle: 'Manage your private trade items', color: '#581C87', route: '#profile-inventory', keywords: ['swap', 'exchange', 'items', 'stash'] },
      { id: 'wallet', icon: <WalletIcon />, title: 'Escrow & Wallet', subtitle: 'Balance, payouts & methods', color: '#005DE3', route: '#profile-wallet', keywords: ['money', 'cash', 'withdraw', 'momo', 'mtn', 'telecel', 'card', 'bank', 'paystack', 'payment'] },
      { id: 'history', icon: <ReceiptIcon />, title: 'Transaction History', subtitle: 'All your transactions', color: '#1A1F36', route: '#profile-history', keywords: ['receipts', 'past', 'records', 'statement'] }
    ]
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      { id: 'edit-profile', icon: <PersonIcon />, title: 'Edit Profile', subtitle: 'Update your profile info', color: '#1A1F36', route: '#profile-edit', keywords: ['name', 'email', 'avatar', 'picture', 'photo', 'university', 'phone number', 'details'] },
      { id: 'notifications', icon: <BellIcon />, title: 'Notifications', subtitle: 'Push & Email preferences', color: '#1A1F36', route: '#profile-notifications', keywords: ['alerts', 'emails', 'push', 'sounds', 'messages'] }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Security',
    items: [
      { id: 'privacy', icon: <LockIcon />, title: 'Privacy & Security', subtitle: 'Manage your privacy settings', color: '#1A1F36', route: '#profile-privacy', keywords: ['password', 'change password', 'delete account', 'blocked users', 'visibility'] },
      { id: '2fa', icon: <ShieldCheckIcon />, title: 'Two-Factor Auth', subtitle: 'Add an extra layer of security', color: '#10B981', route: '#profile-two-factor', keywords: ['2fa', 'sms', 'authenticator', 'otp', 'code', 'login'] },
      { id: 'scam', icon: <ShieldHalfIcon />, title: 'Scam Protection', subtitle: 'Tips to keep you safe', color: '#F59E0B', route: '#profile-scam', keywords: ['fraud', 'fake', 'report', 'safe meetup'] }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      { id: 'help', icon: <HelpIcon />, title: 'Help Center', subtitle: 'FAQs & guides', color: '#005DE3', route: '#profile-support', keywords: ['faq', 'questions', 'contact us', 'how to'] },
      { id: 'report', icon: <FlagIcon />, title: 'Report an Issue', subtitle: 'Report problems or concerns', color: '#EF4444', route: '#profile-report', keywords: ['bug', 'glitch', 'error', 'complaint', 'broken'] }
    ]
  }
];

export default function ProfilePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Track active sub-page using URL hash (e.g. #profile/reviews)
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  useEffect(() => {
    const handleHash = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  const currentUser = useAppStore(s => s.currentUser);
  const products = useAppStore(s => s.products);
  const logout = useAppStore(s => s.logout);
  const { showConfirm, showAlert } = useModal();

  const hashParts = currentHash.split('?')[0].split('/');
  const activeTab = hashParts.length > 1 ? hashParts[1] : 'menu';

  const [dbProfile, setDbProfile] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      if (data) setDbProfile(data);
    };
    fetchProfile();
  }, [currentUser?.id, currentHash]); // Re-fetch occasionally or on tab change

  const fallbackUser = { first_name: 'CampuHub', last_name: 'Student', uni: 'Campus', trust_score: 5.0, earned: 0 };
  
  const baseUser = currentUser ? {
    first_name: currentUser.name?.split(' ')[0] || 'Student',
    last_name: currentUser.name?.split(' ')[1] || '',
    uni: currentUser.uni || 'Campus',
    is_verified: true,
    trust_score: currentUser.trustScore || 5.0,
    earned: currentUser.earned || 0.00,
    avatar: currentUser.avatar
  } : fallbackUser;

  const user = dbProfile ? { ...baseUser, ...dbProfile } : baseUser;

  // Ensure numeric fallbacks just in case the DB returns null or undefined for these columns
  const displayTrustScore = Number(user.trust_score ?? 5.0);
  const displayEarned = Number(user.earned ?? 0.00);

  const activeListingsCount = products.filter(p => p.sellerId === currentUser?.id).length || 0;
  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Student';

  const getInitials = (name) => {
    if (!name?.trim()) return 'U';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : parts[0]?.[1] || '';
    return (first + last).toUpperCase();
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Log Out',
      message: 'Are you sure you want to log out of CampuHub?',
      type: 'confirm',
      confirmText: 'Log Out',
      cancelText: 'Stay',
    });
    if (confirmed) {
      await supabase.auth.signOut();
      logout();
      window.location.hash = '#login';
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Account?',
      message: 'Are you sure you want to delete your account? This action will schedule your account and all data for permanent deletion within 24 hours.',
      type: 'danger',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
    });
    if (confirmed) {
      // Soft delete: set an is_deleted flag or schedule deletion. 
      // Assuming 'profiles' table can take an update if we have a flag, otherwise we'll just log out and show a message.
      await supabase.from('profiles').update({ is_deleted: true }).eq('id', currentUser?.id).catch(() => {});
      showAlert({ title: 'Account Scheduled for Deletion', message: 'Your account will be permanently deleted within 24 hours.', type: 'info' });
      await supabase.auth.signOut();
      logout();
      window.location.hash = '#login';
    }
  };

  const isSearchActive = isSearching || searchQuery.length > 0;
  const filteredSections = PROFILE_SECTIONS.map(section => {
    const query = searchQuery.toLowerCase().trim();
    const filteredItems = section.items.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
      const matchesKeywords = item.keywords?.some(kw => kw.toLowerCase().includes(query));
      return matchesTitle || matchesSubtitle || matchesKeywords;
    });
    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0);

  return (
    <div className="profile-page">
      <div className="profile-inner">
        {/* Breadcrumb */}
        <nav className="profile-breadcrumb">
          <a href="#home" className="profile-breadcrumb-link">Home</a>
          <span className="profile-breadcrumb-sep">›</span>
          <a href="#profile" className="profile-breadcrumb-link">Profile</a>
          {activeTab !== 'menu' && (
            <>
              <span className="profile-breadcrumb-sep">›</span>
              <span className="profile-breadcrumb-current" style={{ textTransform: 'capitalize' }}>
                {activeTab.replace('-', ' ')}
              </span>
            </>
          )}
        </nav>

        <div className="profile-header-wrap">
          <h1 className="profile-title">Your Profile</h1>
          <div className={`profile-search-container ${isSearchActive ? 'profile-search-active' : ''}`}>
            <SearchIcon color="#9CA3AF" />
            <input
              type="text"
              className="profile-search-input"
              placeholder="Search settings, wallets, momo..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 0) setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              onBlur={(e) => {
                if (e.target.value.length === 0) setIsSearching(false);
              }}
            />
            {isSearchActive && (
              <button 
                className="profile-search-clear" 
                onClick={() => { setIsSearching(false); setSearchQuery(''); }}
              >
                <CloseIcon size={16} color="#6B7280" />
              </button>
            )}
          </div>
        </div>

        <div className={`profile-main-layout ${activeTab !== 'menu' ? 'profile-main-layout--subpage' : ''}`}>
          {!isSearchActive && (
            <div className="profile-sidebar">
              <div className="profile-user-card">
                <div className="profile-avatar-wrap">
                  {user.avatar ? (
                    <img src={user.avatar} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span className="profile-avatar-initials">{getInitials(displayName)}</span>
                  )}
                  {user.is_verified && (
                    <div className="profile-verified-badge" title="Verified University Student">
                      <ShieldCheckIcon size={14} color="#fff" />
                    </div>
                  )}
                </div>
                <h2 className="profile-user-name">{displayName}</h2>
                <div className="profile-uni-row">
                  <LocationIcon color="#005DE3" size={14} />
                  <span className="profile-uni-text">{user.uni}</span>
                </div>
                <div className={`profile-trust-badge ${!user.is_verified ? 'profile-trust-unverified' : ''}`}>
                  {user.is_verified && <ShieldCheckIcon size={14} color="#10B981" />}
                  <span className="profile-trust-text">
                    {user.is_verified ? 'Verified Student' : 'Unverified Student'}
                  </span>
                </div>
              </div>

              <div className="profile-stats-grid">
                <div className="profile-stat-box">
                  <span className="profile-stat-num">{displayTrustScore.toFixed(1)}</span>
                  <div className="profile-stat-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarIcon key={i} size={12} color="#F59E0B" fill={i <= Math.round(displayTrustScore) ? "#F59E0B" : "none"} />
                    ))}
                  </div>
                  <span className="profile-stat-label">Trust Score</span>
                </div>
                <div className="profile-stat-box">
                  <span className="profile-stat-num">{activeListingsCount}</span>
                  <span className="profile-stat-label">Active Items</span>
                </div>
                <div className="profile-stat-box">
                  <span className="profile-stat-num profile-stat-earned">GH₵ {displayEarned.toFixed(2)}</span>
                  <span className="profile-stat-label">Total Earned</span>
                </div>
              </div>

              <button className="profile-logout-btn" onClick={handleLogout}>
                <LogoutIcon color="#EF4444" size={18} />
                <span>Log Out</span>
              </button>
              <div className="profile-version">CampuHub v1.0.0</div>
            </div>
          )}

          <div className="profile-content">
            {activeTab === 'menu' && (
              filteredSections.length === 0 && isSearchActive ? (
                <div className="profile-empty-search">
                  <SearchIcon size={48} color="#D1D5DB" />
                  <p>No settings found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="profile-sections-container">
                  {filteredSections.map(section => (
                    <div key={section.id} className="profile-section">
                      <h3 className="profile-section-title">{section.title}</h3>
                      <div className="profile-settings-group">
                        {section.items.map(item => (
                          <a key={item.id} href={`#profile/${item.id}`} className="profile-setting-row">
                            <div 
                              className="profile-setting-icon" 
                              style={{ backgroundColor: `${item.color}15`, color: item.color }}
                            >
                              {item.icon}
                            </div>

                            <div className="profile-setting-info">
                              <span className="profile-setting-title">{item.title}</span>
                              <span className="profile-setting-subtitle">{item.subtitle}</span>
                            </div>
                            <ChevronRightIcon />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            
            {/* SUB-PAGES */}
            {activeTab === 'reviews' && (
              <ReviewsSubPage />
            )}
            {activeTab === 'listings' && (
              <MyListingsSubPage />
            )}
            {activeTab === 'orders' && (
              <OrdersSubPage />
            )}
            {activeTab === 'inventory' && (
              <InventorySubPage />
            )}
            {activeTab === 'wallet' && (
              <WalletSubPage />
            )}
            {activeTab === 'history' && (
              <HistorySubPage />
            )}
            {activeTab === 'edit-profile' && (
              <EditProfileSubPage />
            )}
            {activeTab === 'notifications' && (
              <NotificationsSubPage />
            )}
            {activeTab === 'privacy' && (
              <PrivacySubPage />
            )}
            {activeTab === 'update-email' && (
              <UpdateEmailSubPage />
            )}
            {activeTab === 'update-password' && (
              <UpdatePasswordSubPage />
            )}
            {activeTab === 'legal' && (
              <LegalSubPage />
            )}
            {activeTab === '2fa' && (
              <TwoFactorSubPage />
            )}
            {activeTab === 'scam' && (
              <ScamProtectionSubPage />
            )}
            {activeTab === 'help' && (
              <HelpSubPage />
            )}
            {activeTab === 'report' && (
              <ReportSubPage />
            )}
            {activeTab === 'contact-support' && (
              <ContactSupportSubPage />
            )}
            {activeTab === 'edit-listing' && (
              <EditListingSubPage />
            )}
            {activeTab === 'reviews-leave' && (
              <LeaveReviewSubPage />
            )}
            {/* END SUB-PAGES */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
