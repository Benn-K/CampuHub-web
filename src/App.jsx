import { useState, useEffect } from 'react'
import './index.css'
import { useAppStore } from './store'
import { supabase } from './supabaseClient'
import { useModal } from './components/modal/ModalContext'

import CategoriesPage from './pages/categories/CategoriesPage'
import MessagesPage from './pages/messages/MessagesPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/cart/CartPage'
import ProductDetailsPage from './pages/products/ProductDetailsPage'
import ProfilePage from './pages/profile/ProfilePage'
import CategoryProductsPage from './pages/categories/CategoryProductsPage'
import ListProductPage from './pages/ListProductPage'
import DealReviewPage from './pages/messages/DealReviewPage'
import ChatPage from './pages/messages/ChatPage'
import AllReviewsPage from './pages/products/AllReviewsPage'
import SellerProfilePage from './pages/products/SellerProfilePage'
import SearchPage from './pages/search/SearchPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import VerifyCodePage from './pages/auth/VerifyCodePage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DealCheckoutPage from './pages/checkout/DealCheckoutPage'
import HomePage from './pages/home/HomePage'

// Images
import productBackpack from './assets/product-backpack.png'
import productTextbooks from './assets/product-textbooks.png'
import productLaptop from './assets/product-laptop.png'
import serviceTutor from './assets/service-tutor.png'
import serviceMentor from './assets/service-mentor.png'
import campusStudy from './assets/campus-study.png'
import campusEvent from './assets/campus-event.png'
import productToothbrush from './assets/product-toothbrush.png'

// ===== ICONS =====
const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)
const HeartIcon = ({ filled = false, color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const SavedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" />
  </svg>
)
const PlusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
)
const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

// Category Icons (matching mobile app)
const AcademicsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M8 7h6" /><path d="M8 11h8" />
  </svg>
)
const ComputingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)
const HostelIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <path d="M12 4v6" /><path d="M2 20h20" />
  </svg>
)
const FashionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6l-1 12h14l-1-12h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
)
const SportsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)
const ElectronicsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
)
const ServicesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const FoodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

// ===== DATA =====
const categories = [
  { name: 'Academics', icon: <AcademicsIcon />, iconClass: 'category-card__icon--academics' },
  { name: 'Computing', icon: <ComputingIcon />, iconClass: 'category-card__icon--computing' },
  { name: 'Hostel Ess.', icon: <HostelIcon />, iconClass: 'category-card__icon--hostel' },
  { name: 'Fashion', icon: <FashionIcon />, iconClass: 'category-card__icon--fashion' },
  { name: 'Sports', icon: <SportsIcon />, iconClass: 'category-card__icon--sports' },
  { name: 'Electronics', icon: <ElectronicsIcon />, iconClass: 'category-card__icon--electronics' },
  { name: 'Services', icon: <ServicesIcon />, iconClass: 'category-card__icon--services' },
  { name: 'Food & Drinks', icon: <FoodIcon />, iconClass: 'category-card__icon--food' },
]

const campusSteals = [
  { id: 1, title: 'Tooth Brush', price: 'GH₵ 8', originalPrice: 'GH₵ 12', badge: 'for sale', image: productToothbrush },
  { id: 2, title: 'Smart Watch', price: 'GH₵ 150', originalPrice: 'GH₵ 200', badge: 'for sale', image: productLaptop },
  { id: 3, title: 'Extension Board', price: 'GH₵ 35', originalPrice: 'GH₵ 45', badge: 'for sale', image: productTextbooks },
  { id: 4, title: 'USB-C Hub', price: 'GH₵ 80', originalPrice: null, badge: 'for sale', image: productLaptop },
  { id: 5, title: 'Backpack Pro', price: 'GH₵ 120', originalPrice: 'GH₵ 180', badge: 'for sale', image: productBackpack },
]

const trendingItems = [
  { id: 6, title: 'MacBook Air M2', price: 'GH₵ 8,500', originalPrice: null, badge: 'for sale', seller: 'JD', image: productLaptop },
  { id: 7, title: 'Campus Pro Backpack', price: 'GH₵ 120', originalPrice: 'GH₵ 180', badge: 'for sale', seller: 'AK', image: productBackpack },
  { id: 8, title: 'Calculus Textbook', price: 'GH₵ 45', originalPrice: 'GH₵ 80', badge: 'for sale', seller: 'SL', image: productTextbooks },
  { id: 9, title: 'Study Desk Lamp', price: 'GH₵ 55', originalPrice: null, badge: 'for sale', seller: 'MP', image: productToothbrush },
  { id: 10, title: 'Wireless Earbuds', price: 'GH₵ 200', originalPrice: 'GH₵ 300', badge: 'for sale', seller: 'TC', image: productLaptop },
  { id: 11, title: 'Laundry Basket', price: 'GH₵ 30', originalPrice: null, badge: 'for sale', seller: 'BW', image: productTextbooks },
  { id: 12, title: 'Mini Fridge', price: 'GH₵ 650', originalPrice: 'GH₵ 900', badge: 'for sale', seller: 'RJ', image: productBackpack },
  { id: 13, title: 'Desk Fan', price: 'GH₵ 40', originalPrice: null, badge: 'for sale', seller: 'KN', image: productToothbrush },
  { id: 14, title: 'Phone Charger', price: 'GH₵ 25', originalPrice: null, badge: 'for sale', seller: 'LR', image: productLaptop },
  { id: 15, title: 'Water Bottle', price: 'GH₵ 15', originalPrice: null, badge: 'for sale', seller: 'DM', image: productTextbooks },
]

const freshListings = [
  { id: 'f1', title: 'Awards', price: 'GH₵ 258', originalPrice: null, badge: 'for sale', condition: 'Like New', image: campusEvent },
  { id: 'f2', title: 'Leaf Plant', price: 'GH₵ 10', originalPrice: null, badge: 'for sale', condition: 'Like New', image: campusStudy },
  { id: 'f3', title: 'Extension Board', price: 'GH₵ 30', originalPrice: 'GH₵ 45', badge: 'for sale', condition: 'Like New', image: productTextbooks },
  { id: 'f4', title: 'Smart Watch', price: 'GH₵ 150', originalPrice: 'GH₵ 200', badge: 'for sale', condition: 'Like New', image: productLaptop },
  { id: 'f5', title: 'Tooth Brush Pack', price: 'GH₵ 8', originalPrice: 'GH₵ 12', badge: 'for sale', condition: 'New', image: productToothbrush },
  { id: 'f6', title: 'Campus Backpack', price: 'GH₵ 120', originalPrice: 'GH₵ 180', badge: 'for sale', condition: 'Like New', image: productBackpack },
  { id: 'f7', title: 'Scientific Calculator', price: 'GH₵ 85', originalPrice: null, badge: 'for sale', condition: 'Used', image: productLaptop },
  { id: 'f8', title: 'Desk Organizer', price: 'GH₵ 20', originalPrice: null, badge: 'for sale', condition: 'New', image: productTextbooks },
]

const services = [
  { id: 's1', title: 'Tutoring — Mathematics', desc: 'Help with Calculus, Linear Algebra & more', price: 'GH₵ 25/hr', image: serviceTutor },
  { id: 's2', title: 'Career Mentorship', desc: 'Get guidance on your career path from seniors', price: 'Free', image: serviceMentor },
  { id: 's3', title: 'Study Group — CS201', desc: 'Weekly group study sessions for Data Structures', price: 'GH₵ 10/session', image: campusStudy },
]

const features = [
  { icon: <ShieldIcon />, iconClass: 'feature-card__icon--blue', title: 'Safe & Secure', desc: 'Verified student accounts, secure messaging, and campus meetup spots.' },
  { icon: <UsersIcon />, iconClass: 'feature-card__icon--green', title: 'For Students', desc: 'Built exclusively for campus communities. Find exactly what you need.' },
  { icon: <ZapIcon />, iconClass: 'feature-card__icon--amber', title: 'Fast & Easy', desc: 'List in seconds, chat directly, and meet up on campus. No shipping.' },
]

// ===== COMPONENTS =====

function BottomNav({ currentHash }) {
  const getNavClass = (path) => {
    const isActive = path === '#profile'
      ? currentHash.startsWith('#profile')
      : currentHash === path;
    return `bottom-nav__item ${isActive ? 'active' : ''}`;
  };

  return (
    <nav className="bottom-nav">
      <a href="#home" className={getNavClass('#home')}>
        <HomeIcon />
        <span>Home</span>
      </a>
      <a href="#search" className={getNavClass('#search')}>
        <SearchIcon />
        <span>Search</span>
      </a>
      <a href="#list" className={getNavClass('#list')}>
        <PlusCircleIcon />
        <span>Sell</span>
      </a>
      <a href="#messages" className={getNavClass('#messages')} style={{ position: 'relative' }}>
        <ChatIcon />
        {useAppStore((s) => s.unreadCount) > 0 && (
          <span style={{ position: 'absolute', top: 4, right: 12, background: '#ef4444', color: 'white', borderRadius: '50%', width: 14, height: 14, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {useAppStore((s) => s.unreadCount)}
          </span>
        )}
        <span>Messages</span>
      </a>
      <a href="#profile" className={getNavClass('#profile')}>
        <UsersIcon />
        <span>Profile</span>
      </a>
    </nav>
  );
}

function Header({ currentHash }) {
  const cartCount = useAppStore((s) => s.cart.length);
  const currentUser = useAppStore((s) => s.currentUser);
  const wishlistCount = useAppStore((s) => s.wishlist.length);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    setSearchQuery(urlParams.get('q') || '');
  }, [currentHash]);

  const getNavClass = (path) => {
    const isActive = path === '#profile'
      ? currentHash.startsWith('#profile')
      : currentHash === path;
    return `nav-action ${isActive ? 'active' : ''}`;
  };

  const userInitials = currentUser
    ? `${currentUser.first_name?.[0] || ''}${currentUser.last_name?.[0] || ''}`.toUpperCase()
    : 'BK';

  return (
    <header className="header" id="header">
      <div className="container">
        <a href="#home" className="header__logo" id="logo">
          <span className="header__logo-icon">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#2563eb" />
              <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
              <circle cx="16" cy="12" r="1.5" fill="#2563eb" />
            </svg>
          </span>
          CampuHub
        </a>

        <div className="header__search" id="header-search">
          <span className="header__search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search textbooks, tech, gear..."
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.target.value.trim() === '') {
                  window.location.hash = '#search';
                } else {
                  window.location.hash = `#search?q=${encodeURIComponent(e.target.value.trim())}`;
                }
              }
            }}
          />
        </div>

        <div className="header__actions">
          <a href="#categories" className={getNavClass('#categories')} id="nav-categories" data-tooltip="Categories">
            <GridIcon />
          </a>
          <a href="#wishlist" className={getNavClass('#wishlist')} id="nav-wishlist" data-tooltip="Wishlist" style={{ position: 'relative' }}>
            <HeartIcon />
            {wishlistCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>
            )}
          </a>
          <a href="#messages" className={getNavClass('#messages')} id="nav-messages" data-tooltip="Messages" style={{ position: 'relative' }}>
            <ChatIcon />
            {useAppStore((s) => s.unreadCount) > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {useAppStore((s) => s.unreadCount)}
              </span>
            )}
          </a>
          <a href="#cart" className={getNavClass('#cart')} id="cart-btn" data-tooltip="Cart" style={{ position: 'relative' }}>
            <CartIcon />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </a>
          <a href="#list" className={getNavClass('#list')} id="nav-list" data-tooltip="List Item">
            <PlusCircleIcon />
          </a>
          <a href="#profile" className={`${getNavClass('#profile')} nav-action--profile`} id="user-avatar" data-tooltip="Profile">
            <div className="header__avatar">{userInitials}</div>
          </a>
        </div>
      </div>
    </header>
  )
}

function HeroBanner() {
  return (
    <div className="hero-banner" id="hero-banner">
      <div className="hero-banner__content">
        <p className="hero-banner__greeting">Welcome to CampuHub 👋</p>
        <h1 className="hero-banner__title">
          Everything you need,<br />from people you trust.
        </h1>
        <div className="hero-banner__badges">
          <span className="hero-banner__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            For Students
          </span>
          <span className="hero-banner__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Safe & Secure
          </span>
        </div>
      </div>
      <div className="hero-banner__image">
        <img src={productBackpack} alt="Campus backpack" />
      </div>
    </div>
  )
}

function LocationBar() {
  return (
    <div className="location-bar" id="location-bar">
      <span className="location-bar__icon"><PinIcon /></span>
      <span className="location-bar__text">University of Ghana</span>
      <span className="location-bar__status">· Legon Campus</span>
    </div>
  )
}

function Categories() {
  return (
    <div className="categories" id="categories">
      <div className="categories__grid">
        {categories.map((cat, i) => (
          <div className="category-card" key={i} id={`cat-${cat.name.toLowerCase().replace(/[^a-z]/g, '')}`}>
            <div className={`category-card__icon ${cat.iconClass}`}>
              {cat.icon}
            </div>
            <span className="category-card__name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  const saved = wishlist.includes(product.id);
  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card__image-wrap">
        <a href={`#product/${product.id}`}>
          <img src={product.image} alt={product.title} loading="lazy" />
        </a>
        <span className={`product-card__badge product-card__badge--${product.badge === 'for sale' ? 'sale' : product.badge === 'wanted' ? 'wanted' : 'free'}`}>
          {product.badge}
        </span>
        <button
          className="product-card__save"
          aria-label="Save item"
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          style={{ opacity: saved ? 1 : undefined }}
        >
          <HeartIcon filled={saved} color={saved ? '#ef4444' : 'currentColor'} />
        </button>
      </div>
      <div className="product-card__info">
        <a href={`#product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-card__title">{product.title}</h3>
        </a>
        <div className="product-card__price-row">
          {product.originalPrice && <span className="product-card__price-original">{product.originalPrice}</span>}
          <span className="product-card__price-current">{product.priceDisplay || product.price}</span>
          {product.condition && <span className="product-card__condition">{product.condition}</span>}
        </div>
        {product.seller && (
          <div className="product-card__meta">
            <span className="product-card__meta-avatar">{product.seller}</span>
            <span>Listed 2d ago</span>
          </div>
        )}
      </div>
    </div>
  )
}

function CampusStealsSection() {
  return (
    <div className="products-section scroll-section" id="campus-steals">
      <div className="section-header">
        <h2 className="section-header__title">Campus Steals</h2>
        <a href="#all-steals" className="section-header__link" id="view-steals">View All <ChevronRight /></a>
      </div>
      <div className="product-scroll">
        {campusSteals.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}

function FreshListingsSection() {
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  const products = useAppStore((s) => s.products);
  // Show the 8 most recently added products
  const freshListings = products.slice(0, 8);
  return (
    <div className="products-section" id="fresh-listings">
      <div className="section-header">
        <h2 className="section-header__title">Fresh Listings</h2>
        <a href="#search" className="section-header__link" id="view-fresh">View All <ChevronRight /></a>
      </div>
      <div className="fresh-grid">
        {freshListings.map(p => {
          const saved = wishlist.includes(p.id);
          return (
            <div className="product-card" key={p.id} id={`product-${p.id}`} style={{ cursor: 'pointer' }}
              onClick={() => { window.location.hash = `#product/${p.id}`; }}>
              <div className="product-card__image-wrap">
                <img src={p.images?.[0] || p.image} alt={p.title} loading="lazy" />
                <span className="product-card__badge product-card__badge--sale">{p.badge || p.type?.toLowerCase()}</span>
                <button
                  className="product-card__save"
                  aria-label="Save item"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                  style={{ opacity: saved ? 1 : undefined }}
                >
                  <HeartIcon filled={saved} color={saved ? '#ef4444' : 'currentColor'} />
                </button>
              </div>
              <div className="product-card__body">
                <p className="product-card__title">{p.title}</p>
                <div className="product-card__price">
                  {p.originalPrice && <span className="product-card__price-original">{p.originalPrice}</span>}
                  <span className="product-card__price-current">{p.priceDisplay || p.price}</span>
                  {p.condition && <span className="product-card__condition">{p.condition}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

function PromoBanner() {
  return (
    <div className="promo-banner" id="promo-banner">
      <div className="promo-banner__content">
        <h3 className="promo-banner__title">Got stuff collecting dust?</h3>
        <p className="promo-banner__desc">Turn your old gear into cash or trade it today.</p>
        <a href="#list" className="btn btn--white promo-banner__btn" id="promo-list-btn">List an Item</a>
      </div>
      <div className="promo-banner__icon">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    </div>
  )
}

function TopSellers() {
  const sellers = [
    { id: 1, name: 'Amara K.', initials: 'AK', rating: '4.9' },
    { id: 2, name: 'James D.', initials: 'JD', rating: '4.8' },
    { id: 3, name: 'Sarah L.', initials: 'SL', rating: '5.0' },
    { id: 4, name: 'Kofi M.', initials: 'KM', rating: '4.7' },
    { id: 5, name: 'Tina C.', initials: 'TC', rating: '4.9' },
    { id: 6, name: 'Ben W.', initials: 'BW', rating: '4.6' },
  ]
  return (
    <div className="products-section" id="top-sellers">
      <div className="section-header">
        <h2 className="section-header__title">Top Verified Sellers</h2>
      </div>
      <div className="sellers-scroll">
        {sellers.map(s => (
          <div className="seller-item" key={s.id} id={`seller-${s.id}`}>
            <div className="seller-avatar-wrap">
              <div className="seller-avatar">{s.initials}</div>
              <span className="seller-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </span>
            </div>
            <span className="seller-name">{s.name}</span>
            <span className="seller-rating">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              {s.rating}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendingSection() {
  return (
    <div className="products-section trending-section" id="trending">
      <div className="section-header">
        <h2 className="section-header__title">Trending on Campus</h2>
        <a href="#all-trending" className="section-header__link" id="view-trending">View All <ChevronRight /></a>
      </div>
      <div className="product-grid">
        {trendingItems.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}

function ServicesSection() {
  return (
    <div className="products-section" id="services">
      <div className="section-header">
        <h2 className="section-header__title">Campus Services</h2>
        <a href="#all-services" className="section-header__link" id="view-services">View All <ChevronRight /></a>
      </div>
      <div className="services-grid">
        {services.map(s => (
          <div className="service-card" key={s.id} id={`service-${s.id}`}>
            <div className="service-card__image">
              <img src={s.image} alt={s.title} loading="lazy" />
            </div>
            <div className="service-card__body">
              <p className="service-card__title">{s.title}</p>
              <p className="service-card__desc">{s.desc}</p>
              <p className="service-card__price">{s.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsBar() {
  return (
    <div className="stats-bar" id="stats">
      <div className="stat-card">
        <p className="stat-card__number">2,500+</p>
        <p className="stat-card__label">Active Listings</p>
      </div>
      <div className="stat-card">
        <p className="stat-card__number">1,200+</p>
        <p className="stat-card__label">Students</p>
      </div>
      <div className="stat-card">
        <p className="stat-card__number">98%</p>
        <p className="stat-card__label">Satisfaction</p>
      </div>
      <div className="stat-card">
        <p className="stat-card__number">24/7</p>
        <p className="stat-card__label">Support</p>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <div className="products-section" id="features">
      <div className="section-header" style={{ justifyContent: 'center' }}>
        <h2 className="section-header__title">Why choose CampuHub?</h2>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i} id={`feature-${i}`}>
            <div className={`feature-card__icon ${f.iconClass}`}>{f.icon}</div>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CTASection() {
  return (
    <div className="cta-section" id="cta">
      <h2 className="cta-section__title">Start buying & selling on campus</h2>
      <p className="cta-section__desc">Join thousands of students already using CampuHub. List your first item in seconds.</p>
      <div className="cta-section__actions">
        <a href="#signup" className="btn btn--white" id="cta-signup">Get Started Free</a>
        <a href="#list" className="btn btn--outline-white" id="cta-list">
          <PlusCircleIcon /> List an Item
        </a>
      </div>
    </div>
  )
}

function Footer({ showComingSoon }) {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="footer__logo">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
                <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
                <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.6)" />
              </svg>
              CampuHub
            </div>
            <p className="footer__desc">Your campus marketplace. Buy, sell, and connect with students across your university.</p>
          </div>

          <div>
            <p className="footer__col-title">Company</p>
            <div className="footer__col-links">
              <a href="#about" onClick={showComingSoon}>About</a>
              <a href="#careers" onClick={showComingSoon}>Careers</a>
              <a href="#press" onClick={showComingSoon}>Press</a>
              <a href="#contact" onClick={showComingSoon}>Contact</a>
            </div>
          </div>
          <div>
            <p className="footer__col-title">Support</p>
            <div className="footer__col-links">
              <a href="#help" onClick={showComingSoon}>Help Center</a>
              <a href="#safety" onClick={showComingSoon}>Safety</a>
              <a href="#terms" onClick={showComingSoon}>Terms</a>
              <a href="#privacy" onClick={showComingSoon}>Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 CampuHub. All rights reserved.</span>
          <div className="footer__socials">
            <a href="#twitter" onClick={showComingSoon} className="footer__social" aria-label="Twitter" id="social-twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#instagram" onClick={showComingSoon} className="footer__social" aria-label="Instagram" id="social-instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /></svg>
            </a>
            <a href="#tiktok" onClick={showComingSoon} className="footer__social" aria-label="TikTok" id="social-tiktok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.75a8.26 8.26 0 004.84 1.56V6.87a4.85 4.85 0 01-1.12-.18z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ===== MAIN APP =====
function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');
  const [toastMsg, setToastMsg] = useState('');
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const { showAuthModal } = useModal();

  const fetchProducts = useAppStore((s) => s.fetchProducts);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const setUnreadCount = useAppStore((s) => s.setUnreadCount);
  const currentUser = useAppStore((s) => s.currentUser);

  const showComingSoon = (e) => {
    e.preventDefault();
    setToastMsg('Coming Soon! This feature is under construction.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    // 1. Fetch live marketplace products on load
    fetchProducts();

    // 2. Initial Session Check & Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Student',
          email: session.user.email,
          avatar: metadata.avatar,
          phone: metadata.phone,
        });
      }
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          first_name: metadata.first_name || '',
          last_name: metadata.last_name || '',
          name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'Student',
          email: session.user.email,
          avatar: metadata.avatar,
          phone: metadata.phone,
        });
      } else {
        setCurrentUser(null);
      }
      setIsSessionLoading(false);
    });

    // Existing Hash Logic
    if (!window.location.hash) {
      window.location.hash = '#home';
    }
    
    const protectedRoutes = ['#categories', '#list', '#wishlist', '#cart', '#messages', '#chat', '#profile', '#deal'];
    const isProtectedRoute = (hash) => protectedRoutes.some(route => hash.startsWith(route));

    const handleHashChange = () => {
      const newHash = window.location.hash;
      const isGuest = !useAppStore.getState().currentUser;

      // Rule: Logged-in users skip auth pages
      if (!isGuest && (newHash === '#signup' || newHash === '#login' || newHash.startsWith('#auth/'))) {
        window.location.hash = '#home';
        return;
      }

      // Rule: Guest Browsing Interception
      if (isGuest && isProtectedRoute(newHash)) {
        window.history.replaceState(null, '', '#home');
        setCurrentHash('#home');
        showAuthModal({
          title: 'Join CampuHub',
          message: 'You need to create an account or log in to do that action.'
        });
        return;
      }

      setCurrentHash(newHash);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      subscription.unsubscribe();
    };
  }, []);

  // Monitor Unread Messages
  useEffect(() => {
    if (!currentUser?.id) {
      setUnreadCount(0);
      return;
    }
    
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    const channel = supabase.channel(`unread_${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUser.id}` }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, setUnreadCount]);

  const isCategories = currentHash === '#categories';
  const isMessages = currentHash === '#messages';
  const isWishlist = currentHash === '#wishlist';
  const isCart = currentHash === '#cart';
  const isProfile = currentHash.startsWith('#profile');
  const isListProduct = currentHash === '#list';
  const isDealReview = currentHash.startsWith('#deal');
  const isChat = currentHash.startsWith('#chat');
  const isAllReviews = currentHash === '#reviews';
  const isSellerProfile = currentHash.startsWith('#seller');
  const isSearch = currentHash.startsWith('#search');
  const isCategoryProducts = currentHash.startsWith('#category/');
  const isProduct = currentHash.startsWith('#product');
  const isCheckout = currentHash.startsWith('#checkout');
  const isLogin = currentHash === '#auth/login' || currentHash === '#login';
  const isSignUp = currentHash === '#auth/signup' || currentHash === '#signup';
  const isVerifyCode = currentHash.startsWith('#auth/verify-code') || currentHash.startsWith('#verify-code');
  const isResetPassword = currentHash.startsWith('#auth/reset-password') || currentHash.startsWith('#reset-password');

  // Extract category ID if on category products page
  const categoryIdMatch = currentHash.match(/^#category\/(.+)$/);
  const selectedCategoryId = categoryIdMatch ? decodeURIComponent(categoryIdMatch[1]) : 'all';

  if (isSessionLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'auth-spin 0.8s linear infinite' }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <p style={{ marginTop: '16px', color: '#475569', fontWeight: '500' }}>Loading CampuHub...</p>
        <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isLogin) {
    return <LoginPage />;
  }

  if (isSignUp) {
    return <SignUpPage />;
  }

  if (isVerifyCode) {
    return <VerifyCodePage />;
  }

  if (isResetPassword) {
    return <ResetPasswordPage />;
  }

  return (
    <>
      <Header currentHash={currentHash} />
      <main className="main">
        <div className="container">
          {isCategories ? (
            <CategoriesPage />
          ) : isMessages ? (
            <MessagesPage />
          ) : isWishlist ? (
            <WishlistPage />
          ) : isCart ? (
            <CartPage />
          ) : isProfile ? (
            <ProfilePage />
          ) : isListProduct ? (
            <ListProductPage />
          ) : isDealReview ? (
            <DealReviewPage />
          ) : isChat ? (
            <ChatPage />
          ) : isAllReviews ? (
            <AllReviewsPage />
          ) : isSellerProfile ? (
            <SellerProfilePage />
          ) : isSearch ? (
            <SearchPage />
          ) : isCategoryProducts ? (
            <CategoryProductsPage categoryId={selectedCategoryId} />
          ) : isProduct ? (
            <ProductDetailsPage />
          ) : isCheckout ? (
            <DealCheckoutPage />
          ) : (
            <>
              <HomePage />
            </>
          )}
        </div>
      </main>
      <Footer showComingSoon={showComingSoon} />
      <BottomNav currentHash={currentHash} />

      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 500,
          fontSize: 14,
          animation: 'fade-in 0.3s ease'
        }}>
          {toastMsg}
        </div>
      )}
    </>
  )
}

export default App