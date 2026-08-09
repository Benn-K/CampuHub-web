import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// Mocking expo-router for Web
const router = {
  back: () => window.location.hash = '#profile',
  push: (route) => {
    if (typeof route === 'object' && route.pathname) {
      window.location.hash = `#${route.pathname.replace('/', '')}`;
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
  } else if (name === 'options-outline') {
    iconContent = <><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></>;
  } else if (name === 'cube-outline') {
    iconContent = <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>;
  } else if (name === 'trash-outline') {
    iconContent = <><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></>;
  } else if (name === 'rocket-outline') {
    iconContent = <><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>;
  } else if (name === 'close') {
    iconContent = <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>;
  } else if (name === 'checkmark') {
    iconContent = <polyline points="20 6 9 17 4 12"></polyline>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {iconContent}
    </svg>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%', position: 'relative' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  sortBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  
  filterRow: { paddingLeft: 20, paddingRight: 20, marginBottom: 5, display: 'flex', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' },
  filterChip: { paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterChipActive: { backgroundColor: '#1A1F36', borderColor: '#1A1F36' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280', margin: 0 },
  filterTextActive: { color: '#fff' },
  
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 60 },
  sectionHeader: { marginTop: 10, marginBottom: 15 },
  sectionSubtitle: { fontSize: 13, color: '#6B7280', fontWeight: '600', margin: 0 },
  
  inventoryCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 15, boxShadow: '0 4px 8px rgba(0,0,0,0.03)', borderWidth: 1, borderStyle: 'solid', borderColor: '#F3F4F6' },
  cardTopRow: { display: 'flex', flexDirection: 'row' },
  itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee', marginRight: 15, objectFit: 'cover' },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#1A1F36', marginBottom: 6, margin: 0 },
  priceRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  itemPrice: { fontSize: 15, fontWeight: '900', color: '#005DE3', margin: 0 },
  badge: { paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: '0.5px', margin: 0 },
  itemCondition: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', margin: 0 },
  cardDivider: { height: 1, backgroundColor: '#F3F4F6', marginTop: 15, marginBottom: 15 },
  
  actionRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { padding: 10, backgroundColor: '#FFF1F2', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: 'none' },
  rightActions: { display: 'flex', flexDirection: 'row', gap: 10 },
  editBtn: { paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#F3F4F6', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: 'none' },
  editBtnText: { fontSize: 13, fontWeight: '700', color: '#1A1F36', margin: 0 },
  publishBtn: { display: 'flex', flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#005DE3', borderRadius: 12, justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: 'none' },
  publishBtnText: { fontSize: 13, fontWeight: '800', color: '#fff', margin: 0 },
  
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, paddingLeft: 30, paddingRight: 30 },
  emptyTitle: { marginTop: 15, fontSize: 18, color: '#1A1F36', fontWeight: '800', margin: 0 },
  emptySub: { marginTop: 5, fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: '20px', margin: 0 },
  emptyBtn: { marginTop: 20, backgroundColor: '#EAEFFF', paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12, borderRadius: 12, cursor: 'pointer', border: 'none' },
  emptyBtnText: { color: '#005DE3', fontWeight: '800', fontSize: 14, margin: 0 },

  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 100 },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 25, paddingBottom: 40 },
  modalHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  modalOption: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, paddingBottom: 18, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#F3F4F6', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', width: '100%', textAlign: 'left' },
  modalOptionText: { fontSize: 16, color: '#4B5563', fontWeight: '600', margin: 0 }
};

export default function InventorySubPage() {
  const { showAlert, showConfirm } = useModal();
  const user = useAppStore((state) => state.currentUser);

  const [liveInventory, setLiveInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('None');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'draft')
          .eq('seller_id', user.id);

        if (error) throw error;

        const formatted = (data || []).map((item) => ({
          ...item,
          type: item.listing_type ? item.listing_type.toUpperCase() : 'FOR SALE',
          image: item.image_url || (item.images && item.images[0]) || 'https://picsum.photos/seed/fallback/150/150',
          price: typeof item.price === 'number' && item.price > 0 ? `GH₵ ${item.price.toFixed(2)}` : 'TRADE',
        }));
        
        setLiveInventory(formatted);
      } catch (err) {
        console.error("Error fetching inventory drafts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrafts();
  }, [user]);

  const handleDelete = (id) => {
    (async () => {
      const confirmed = await showConfirm({
        title: 'Delete Item?',
        message: 'Are you sure you want to permanently remove this from your inventory? This cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep It',
        type: 'delete'
      });
      if (!confirmed) return;
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setLiveInventory(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        showAlert({ title: 'Delete Failed', message: 'Could not remove the item. Please try again.', type: 'error' });
        console.error(err);
      }
    })();
  };

  const handlePublish = (item) => {
    (async () => {
      const confirmed = await showConfirm({
        title: 'Publish Listing?',
        message: 'This will move the item from your private stash and make it live on the marketplace.',
        confirmText: 'Publish',
        type: 'confirm'
      });
      if (!confirmed) return;
      try {
        const { error } = await supabase.from('products').update({ status: 'live' }).eq('id', item.id);
        if (error) throw error;
        setLiveInventory(prev => prev.filter(i => i.id !== item.id));
        showAlert({ title: '🎉 Item is Live!', message: 'Your item has been published to the campus marketplace.', type: 'success' });
      } catch (err) {
        console.error(err);
        showAlert({ title: 'Publish Failed', message: 'Could not publish the item. Please try again.', type: 'error' });
      }
    })();
  };

  const handleEdit = () => {
    router.push('/list');
  };

  const parsePrice = (priceStr) => {
    if (!priceStr || typeof priceStr !== 'string' || priceStr.toUpperCase() === 'TRADE') return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  let filteredInventory = liveInventory.filter((item) => {
    if (typeFilter === 'All') return true;
    return item.type === typeFilter;
  });

  if (sortOrder === 'Asc') {
    filteredInventory.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortOrder === 'Desc') {
    filteredInventory.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  const getBadgeStyle = (type) => {
    switch(type) {
      case 'FOR RENT': return { bg: '#E0D4FF', text: '#6A0DAD' }; 
      case 'FOR TRADE': return { bg: '#FFE4CC', text: '#D35400' }; 
      case 'FOR SALE': return { bg: '#D6E4FF', text: '#005DE3' }; 
      default: return { bg: '#eee', text: '#333' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>My Inventory</p>
        <button style={styles.sortBtn} onClick={() => setIsSortModalOpen(true)}>
          <Ionicons name="options-outline" size={24} color={sortOrder !== 'None' ? "#005DE3" : "#1A1F36"} />
        </button>
      </div>

      <div style={styles.filterRow}>
        {['All', 'FOR SALE', 'FOR RENT', 'FOR TRADE'].map((filter) => {
          const displayLabel = filter === 'All' ? 'All Items' : filter.replace('FOR ', '');
          return (
            <button 
              key={filter} 
              style={{ ...styles.filterChip, ...(typeFilter === filter ? styles.filterChipActive : {}) }} 
              onClick={() => setTypeFilter(filter)}
            >
              <p style={{ ...styles.filterText, ...(typeFilter === filter ? styles.filterTextActive : {}) }}>
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
          ) : filteredInventory.length === 0 ? (
            <div style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <p style={styles.emptyTitle}>Stash is empty</p>
              <p style={styles.emptySub}>You don't have any private drafts saved right now.</p>
              <button style={styles.emptyBtn} onClick={() => router.push('/list')}>
                <p style={styles.emptyBtnText}>Create Draft</p>
              </button>
            </div>
          ) : (
            <>
              <div style={styles.sectionHeader}>
                <p style={styles.sectionSubtitle}>{filteredInventory.length} items in your stash</p>
              </div>
              
              {filteredInventory.map((item) => {
                const badge = getBadgeStyle(item.type);
                return (
                  <div key={item.id} style={styles.inventoryCard}>
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
                        <p style={styles.itemCondition}>Condition: {item.condition || 'N/A'}</p>
                      </div>
                    </div>

                    <div style={styles.cardDivider} />

                    <div style={styles.actionRow}>
                      <button style={styles.iconBtn} onClick={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#FF4757" />
                      </button>
                      
                      <div style={styles.rightActions}>
                        <button style={styles.editBtn} onClick={handleEdit}>
                          <p style={styles.editBtnText}>Edit</p>
                        </button>
                        
                        <button style={styles.publishBtn} onClick={() => handlePublish(item)}>
                          <Ionicons name="rocket-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                          <p style={styles.publishBtnText}>Publish Live</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Sort Modal */}
      {isSortModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsSortModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <p style={styles.modalTitle}>Sort Inventory</p>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsSortModalOpen(false)}>
                <Ionicons name="close" size={24} color="#1A1F36" />
              </button>
            </div>
            
            <button style={styles.modalOption} onClick={() => { setSortOrder('None'); setIsSortModalOpen(false); }}>
              <p style={{ ...styles.modalOptionText, ...(sortOrder === 'None' ? { color: '#005DE3', fontWeight: '800' } : {}) }}>Newest Added (Default)</p>
              {sortOrder === 'None' && <Ionicons name="checkmark" size={20} color="#005DE3" />}
            </button>

            <button style={styles.modalOption} onClick={() => { setSortOrder('Asc'); setIsSortModalOpen(false); }}>
              <p style={{ ...styles.modalOptionText, ...(sortOrder === 'Asc' ? { color: '#005DE3', fontWeight: '800' } : {}) }}>Price: Low to High</p>
              {sortOrder === 'Asc' && <Ionicons name="checkmark" size={20} color="#005DE3" />}
            </button>

            <button style={styles.modalOption} onClick={() => { setSortOrder('Desc'); setIsSortModalOpen(false); }}>
              <p style={{ ...styles.modalOptionText, ...(sortOrder === 'Desc' ? { color: '#005DE3', fontWeight: '800' } : {}) }}>Price: High to Low</p>
              {sortOrder === 'Desc' && <Ionicons name="checkmark" size={20} color="#005DE3" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
