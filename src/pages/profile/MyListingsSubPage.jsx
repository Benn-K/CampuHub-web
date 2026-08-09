import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';

// Mocking expo-router for Web
const router = {
  back: () => window.location.hash = '#profile',
  push: (route) => {
    if (typeof route === 'object' && route.pathname) {
      window.location.hash = `#${route.pathname.replace('/', '')}?id=${route.params?.id}`;
    } else {
      window.location.hash = `#${route.replace('/', '')}`;
    }
  }
};

// Transforming Ionicons to SVG
const Ionicons = ({ name, size, color, style }) => {
  let iconContent = null;
  if (name === 'arrow-back') {
    iconContent = <><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></>;
  } else if (name === 'eye-outline') {
    iconContent = <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>;
  } else if (name === 'checkmark-circle') {
    iconContent = <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></>;
  } else if (name === 'pencil') {
    iconContent = <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></>;
  } else if (name === 'trash-outline') {
    iconContent = <><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></>;
  } else if (name === 'eye-off-outline') {
    iconContent = <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>;
  } else if (name === 'pricetags-outline') {
    iconContent = <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {iconContent}
    </svg>
  );
};

// Transforming React Native StyleSheet to Web Inline Styles
const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0 },
  masterTabContainer: { display: 'flex', flexDirection: 'row', backgroundColor: '#EAEFFF', borderRadius: 16, padding: 4, marginLeft: 20, marginRight: 20, marginBottom: 15 },
  masterTabBtn: { flex: 1, display: 'flex', flexDirection: 'row', paddingTop: 12, paddingBottom: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 12, background: 'transparent', border: 'none', cursor: 'pointer' },
  masterTabBtnActive: { backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  masterTabText: { fontSize: 14, fontWeight: '700', color: '#6A8BCC', margin: 0 },
  masterTabTextActive: { color: '#005DE3', fontWeight: '800' },
  badgeCount: { backgroundColor: '#005DE3', borderRadius: 10, paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, marginLeft: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  badgeCountText: { color: '#fff', fontSize: 10, fontWeight: '900', margin: 0 },
  subFilterRow: { paddingLeft: 20, paddingRight: 20, marginBottom: 15, display: 'flex', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' },
  subFilterChip: { paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer', whiteSpace: 'nowrap' },
  subFilterChipActive: { backgroundColor: '#1A1F36', borderColor: '#1A1F36' },
  subFilterText: { fontSize: 12, fontWeight: '700', color: '#6B7280', margin: 0 },
  subFilterTextActive: { color: '#fff' },
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 60 },
  listingCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.03)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  cardTopRow: { display: 'flex', flexDirection: 'row', marginBottom: 15 },
  itemImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#eee', marginRight: 15, objectFit: 'cover' },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: '#1A1F36', marginBottom: 6, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  priceRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  itemPrice: { fontSize: 15, fontWeight: '900', color: '#005DE3', margin: 0 },
  badge: { paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: '0.5px', margin: 0 },
  metaRow: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginLeft: 6, margin: 0 },
  cardDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 15, marginTop: 0 },
  actionRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editBtn: { flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10, backgroundColor: '#F8F9FB', borderRadius: 12, marginRight: 10, cursor: 'pointer', border: 'none' },
  editBtnText: { fontSize: 13, fontWeight: '700', color: '#1A1F36', margin: 0 },
  removeBtn: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, backgroundColor: '#FFF1F2', borderRadius: 12, cursor: 'pointer', border: 'none' },
  removeBtnText: { fontSize: 13, fontWeight: '700', color: '#FF4757', margin: 0 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, paddingLeft: 30, paddingRight: 30 },
  emptyTitle: { marginTop: 15, fontSize: 18, color: '#1A1F36', fontWeight: '800', marginBottom: 0 },
  emptySub: { marginTop: 5, fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', marginBottom: 0 },
  postBtn: { marginTop: 20, backgroundColor: '#EAEFFF', paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12, borderRadius: 12, cursor: 'pointer', border: 'none' },
  postBtnText: { color: '#005DE3', fontWeight: '800', fontSize: 14, margin: 0 },
};

export default function MyListingsSubPage() {
  const user = useAppStore((state) => state.currentUser);
  
  const [mainTab, setMainTab] = useState('Active');
  const [typeFilter, setTypeFilter] = useState('All');

  // LIVE DATA STATES
  const [liveActiveListings, setLiveActiveListings] = useState([]);
  const [liveCompletedListings, setLiveCompletedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect transformed to useEffect
  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
        
        // Mock data
        const activeRes = {
          data: [
            { id: '1', title: 'Calculus Textbook', price: 150.00, listing_type: 'SELL', image_url: 'https://picsum.photos/seed/textbook/150/150' },
            { id: '2', title: 'Mini Fridge', price: 400.00, listing_type: 'RENT', image_url: 'https://picsum.photos/seed/fridge/150/150' }
          ],
          error: null
        };
        const completedRes = {
          data: [
            { id: 'tx1', amount: 150.00, created_at: new Date().toISOString(), product: { title: 'Calculus Textbook', listing_type: 'SELL', condition: 'Used', image_url: 'https://picsum.photos/seed/textbook/150/150' } }
          ],
          error: null
        };

        if (activeRes.error) throw activeRes.error;
        if (completedRes.error) throw completedRes.error;

        if (activeRes.data) {
          const formattedActive = activeRes.data.map((item) => ({
            ...item,
            type: item.listing_type ? item.listing_type.toUpperCase() : 'FOR SALE',
            image: item.image_url || 'https://picsum.photos/seed/fallback/150/150',
            price: typeof item.price === 'number' ? `GH₵ ${item.price.toFixed(2)}` : item.price,
            views: Math.floor(Math.random() * 50) + 1 
          }));
          setLiveActiveListings(formattedActive);
        }

        if (completedRes.data) {
          const formattedCompleted = completedRes.data.map((tx) => ({
            id: tx.id,
            title: tx.product?.title || 'Marketplace Item',
            price: tx.amount ? `GH₵ ${tx.amount.toFixed(2)}` : 'TRADE',
            type: tx.product?.listing_type?.toUpperCase() || 'SOLD',
            condition: tx.product?.condition || 'Sold',
            image: tx.product?.image_url || 'https://picsum.photos/seed/fallback/150/150',
            date: new Date(tx.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
          }));
          setLiveCompletedListings(formattedCompleted);
        }

      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyListings();
  }, [user]);

  const handleRemove = async (id, isCompleted) => {
    const confirmMessage = isCompleted 
      ? "Hide Record?\n\nHide this transaction from your view? This won't affect your wallet history."
      : "Remove Listing?\n\nAre you sure you want to remove this item from the marketplace? Active negotiations will be cancelled.";
    
    if (window.confirm(confirmMessage)) {
      try {
        if (isCompleted) {
          setLiveCompletedListings(prev => prev.filter(item => item.id !== id));
        } else {
          setLiveActiveListings(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        window.alert("Action Failed\nCould not remove the item. Please try again.");
        console.error(error);
      }
    }
  };

  const getBadgeStyle = (type) => {
    switch(type) {
      case 'FOR RENT': return { bg: '#E0D4FF', text: '#6A0DAD' }; 
      case 'FOR TRADE': return { bg: '#FFE4CC', text: '#D35400' }; 
      case 'FOR SALE': return { bg: '#D6E4FF', text: '#005DE3' }; 
      default: return { bg: '#eee', text: '#333' };
    }
  };

  const currentList = mainTab === 'Active' ? liveActiveListings : liveCompletedListings;
  
  const filteredList = currentList.filter((item) => {
    if (typeFilter === 'All') return true;
    return item.type === typeFilter;
  });

  const renderListingCard = (item, isCompleted) => {
    const badge = getBadgeStyle(item.type);

    return (
      <div key={item.id} style={styles.listingCard}>
        <div style={styles.cardTopRow}>
          <img src={item.image || (item.images && item.images[0])} alt={item.title} style={styles.itemImage} />
          
          <div style={styles.itemInfo}>
            <p style={styles.itemTitle}>{item.title}</p>
            <div style={styles.priceRow}>
              <p style={styles.itemPrice}>{item.price}</p>
              <div style={{ ...styles.badge, backgroundColor: badge.bg }}>
                <p style={{ ...styles.badgeText, color: badge.text }}>{item.type.replace('FOR ', '')}</p>
              </div>
            </div>
            
            {!isCompleted ? (
              <div style={styles.metaRow}>
                <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                <p style={styles.metaText}>{item.views || 0} views</p>
              </div>
            ) : (
              <div style={styles.metaRow}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <p style={{ ...styles.metaText, color: '#10B981' }}>Processed on {item.date}</p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.cardDivider} />

        <div style={styles.actionRow}>
          {!isCompleted && (
            <button 
              style={styles.editBtn} 
              onClick={() => router.push({ pathname: '/profile/edit-listing/', params: { id: item.id } })}
            >
              <Ionicons name="pencil" size={16} color="#1A1F36" style={{ marginRight: 6 }} />
              <p style={styles.editBtnText}>Edit Details</p>
            </button>
          )}
          
          <button 
            style={{ ...styles.removeBtn, ...(isCompleted ? { flex: 1, justifyContent: 'center' } : {}) }} 
            onClick={() => handleRemove(item.id, isCompleted)}
          >
            <Ionicons name={isCompleted ? "eye-off-outline" : "trash-outline"} size={16} color="#FF4757" style={{ marginRight: 6 }} />
            <p style={styles.removeBtnText}>{isCompleted ? "Hide Record" : "Remove"}</p>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>My Listings</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={styles.masterTabContainer}>
        <button 
          style={{ ...styles.masterTabBtn, ...(mainTab === 'Active' ? styles.masterTabBtnActive : {}) }} 
          onClick={() => setMainTab('Active')}
        >
          <p style={{ ...styles.masterTabText, ...(mainTab === 'Active' ? styles.masterTabTextActive : {}) }}>Active</p>
          <div style={styles.badgeCount}><p style={styles.badgeCountText}>{liveActiveListings.length}</p></div>
        </button>
        
        <button 
          style={{ ...styles.masterTabBtn, ...(mainTab === 'Completed' ? styles.masterTabBtnActive : {}) }} 
          onClick={() => setMainTab('Completed')}
        >
          <p style={{ ...styles.masterTabText, ...(mainTab === 'Completed' ? styles.masterTabTextActive : {}) }}>Completed</p>
        </button>
      </div>

      <div style={styles.subFilterRow}>
        {['All', 'FOR SALE', 'FOR RENT', 'FOR TRADE'].map((filter) => {
          const displayLabel = filter === 'All' ? 'All Items' : filter.replace('FOR ', '');
          return (
            <button 
              key={filter} 
              style={{ ...styles.subFilterChip, ...(typeFilter === filter ? styles.subFilterChipActive : {}) }} 
              onClick={() => setTypeFilter(filter)}
            >
              <p style={{ ...styles.subFilterText, ...(typeFilter === filter ? styles.subFilterTextActive : {}) }}>
                {displayLabel}
              </p>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={styles.scrollContent}>
          
          {isLoading ? (
            <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center' }}>
              <p>Loading...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div style={styles.emptyState}>
              <Ionicons name="pricetags-outline" size={48} color="#D1D5DB" />
              <p style={styles.emptyTitle}>No listings found</p>
              <p style={styles.emptySub}>
                {mainTab === 'Active' 
                  ? "You don't have any active items matching this filter." 
                  : "You haven't completed any transactions yet."}
              </p>
              
              {mainTab === 'Active' && (
                <button style={styles.postBtn} onClick={() => window.location.hash = '#list'}>
                  <p style={styles.postBtnText}>Post an Item</p>
                </button>
              )}
            </div>
          ) : (
            filteredList.map((item) => renderListingCard(item, mainTab === 'Completed'))
          )}

        </div>
      </div>
    </div>
  );
}
