import React, { useState, useEffect, useCallback } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const BackIcon = ({ size = 24, color = '#1A1F36' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CheckboxIcon = ({ checked = false, size = 16, color = '#4B5563' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {checked ? <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> : <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>}
  </svg>
);
const SortDownIcon = ({ size = 16, color = '#4B5563' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);
const SortUpIcon = ({ size = 16, color = '#4B5563' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const PersonIcon = ({ size = 16, color = '#6B7280' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const TrashIcon = ({ size = 24, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const StarIcon = ({ size = 14, filled = false, color = '#F59E0B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const CheckmarkCircleIcon = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const BagIcon = ({ size = 48, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const RefreshIcon = ({ size = 16, color = '#4B5563' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const ESCROW_FEE = 1.50;

const S = {
  container: { display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FB', minHeight: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 15px', background: '#fff', borderBottom: '1px solid #F3F4F6' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8F9FB', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 18, fontWeight: 900, color: '#1A1F36', margin: 0 },
  catTabs: { display: 'flex', background: '#fff', padding: '0 20px', borderBottom: '1px solid #F3F4F6' },
  catTab: { flex: 1, padding: '14px 0', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', background: 'none', fontSize: 14, fontWeight: 600, color: '#6B7280' },
  catTabActive: { borderBottomColor: '#005DE3', color: '#005DE3', fontWeight: 800 },
  statusRow: { display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', background: '#F8F9FB' },
  statusChip: { padding: '7px 16px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#fff', fontSize: 12, fontWeight: 700, color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap' },
  statusChipActive: { background: '#1A1F36', borderColor: '#1A1F36', color: '#fff' },
  controlRow: { display: 'flex', justifyContent: 'space-between', padding: '0 20px 12px', gap: 8 },
  ctrlBtn: { flex: 0.48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '9px 0', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#4B5563' },
  list: { flex: 1, overflowY: 'auto', padding: '0 20px 80px' },
  card: { background: '#fff', borderRadius: 20, padding: 16, marginBottom: 15, boxShadow: '0 2px 6px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6', cursor: 'pointer' },
  cardSelected: { borderColor: '#005DE3', background: '#F0F5FF' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sellerRow: { display: 'flex', alignItems: 'center', gap: 6 },
  sellerName: { fontSize: 13, fontWeight: 700, color: '#4B5563', margin: 0 },
  badge: { padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 },
  itemRow: { display: 'flex', gap: 14, alignItems: 'center' },
  thumb: { width: 60, height: 60, borderRadius: 12, objectFit: 'cover', flexShrink: 0, position: 'relative' },
  itemInfo: { flex: 1, overflow: 'hidden' },
  itemTitle: { fontSize: 15, fontWeight: 800, color: '#1A1F36', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  itemPrice: { fontSize: 14, fontWeight: 900, color: '#005DE3', margin: '0 0 4px' },
  itemDate: { fontSize: 11, color: '#9CA3AF', margin: 0 },
  divider: { height: 1, background: '#F3F4F6', margin: '14px 0' },
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: 8 },
  cancelBtn: { padding: '8px 15px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 13, fontWeight: 700 },
  confirmBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#005DE3', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 800 },
  reviewBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7ED', color: '#D97706', border: 'none', padding: '8px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 800 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 800, color: '#1A1F36', margin: 0 },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', margin: 0 },
  fab: { position: 'fixed', bottom: 80, left: 20, right: 20, background: '#1A1F36', borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
  fabBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', fontSize: 15, fontWeight: 600 },
  fabTitle: { color: '#fff', fontSize: 16, fontWeight: 800 },
  spinner: { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
};

const statusBadgeStyle = (status) => {
  const map = {
    ONGOING: { bg: '#FEF3C7', color: '#D97706' },
    COMPLETED: { bg: '#ECFDF5', color: '#10B981' },
    CANCELLED: { bg: '#FEF2F2', color: '#EF4444' },
  };
  return map[status] || { bg: '#F3F4F6', color: '#6B7280' };
};

const statusLabel = (displayStatus, rawStatus) => {
  if (displayStatus === 'ONGOING') {
    if (rawStatus === 'accepted') return 'Accepted — Arrange Meetup';
    if (rawStatus === 'locked_in_escrow') return 'In Escrow';
    if (rawStatus === 'pending_cod') return 'COD — Pending';
    return 'Pending Seller';
  }
  if (displayStatus === 'COMPLETED') return 'Completed';
  if (displayStatus === 'CANCELLED') return rawStatus === 'declined' ? 'Declined by Seller' : 'Cancelled';
  return displayStatus;
};

export default function OrdersSubPage() {
  const { showAlert, showConfirm } = useModal();
  const currentUser = useAppStore(s => s.currentUser);

  const [activeCategory, setActiveCategory] = useState('PURCHASE');
  const [activeStatus, setActiveStatus] = useState('ONGOING');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!currentUser?.id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, status, amount, created_at,
          buyer_id, seller_id,
          products:product_id ( id, title, price, image_url, listing_type )
        `)
        .eq('buyer_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || [])
        .map(tx => {
          const product = tx.products || {};
          const sellerProfile = tx.seller || {};
          const rawAction = (product.listing_type || 'buy').toUpperCase();
          let category = 'PURCHASE';
          if (rawAction === 'RENT') category = 'RENT';
          if (rawAction === 'TRADE') category = 'TRADE';

          const rawStatus = (tx.status || 'pending').toLowerCase();
          let displayStatus = 'ONGOING';
          if (['completed', 'payout_sent'].includes(rawStatus)) displayStatus = 'COMPLETED';
          if (['declined', 'cancelled'].includes(rawStatus)) displayStatus = 'CANCELLED';

          const dateObj = new Date(tx.updated_at || tx.created_at);
          return {
            id: tx.id,
            title: product.title || 'Marketplace Item',
            price: product.price != null ? `GH₵ ${Number(product.price).toFixed(2)}` : 'N/A',
            total: Number(tx.amount || 0).toFixed(2),
            category,
            status: displayStatus,
            rawStatus,
            sellerId: tx.seller_id,
            productId: product.id,
            seller: `${sellerProfile.first_name || ''} ${sellerProfile.last_name || ''}`.trim() || 'Campus Seller',
            date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rawDate: dateObj.getTime(),
            image: product.image_url || `https://picsum.photos/seed/${tx.id}/150`,
          };
        });
      setLiveOrders(formatted);
    } catch (err) {
      console.error('Orders fetch error:', err);
      showAlert({ title: 'Error', message: err.message || 'Could not load your orders. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const toggleOrderSelection = (id) => setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleSelectAll = (visible) => {
    if (selectedOrders.length === visible.length && visible.length > 0) setSelectedOrders([]);
    else setSelectedOrders(visible.map(o => o.id));
  };
  const toggleSelectMode = () => { setIsSelectMode(p => !p); setSelectedOrders([]); };

  const handleDeleteSelected = async () => {
    if (!selectedOrders.length) return;
    const ok = await showConfirm({
      title: 'Hide Orders?',
      message: `Hide ${selectedOrders.length} order(s) from your view? The records still exist in the system.`,
      confirmText: 'Hide',
      type: 'warning',
    });
    if (!ok) return;
    setIsLoading(true);
    try {
      await supabase.from('transactions').update({ buyer_hidden: true }).in('id', selectedOrders);
    } catch (e) { console.error('Hide error:', e); }
    setLiveOrders(prev => prev.filter(o => !selectedOrders.includes(o.id)));
    setSelectedOrders([]);
    setIsSelectMode(false);
    setIsLoading(false);
  };

  const handleCancelOrder = async (order) => {
    const ok = await showConfirm({
      title: 'Cancel Order?',
      message: `Cancel your order for "${order.title}"? The seller will be notified.`,
      confirmText: 'Cancel Order',
      type: 'danger',
    });
    if (!ok) return;
    const { error } = await supabase.from('transactions').update({ status: 'cancelled' }).eq('id', order.id);
    if (error) { showAlert({ title: 'Error', message: error.message, type: 'error' }); return; }
    // Notify seller
    await supabase.from('notifications').insert([{
      user_id: order.sellerId, type: 'order_cancelled',
      message: `The buyer cancelled their order for "${order.title}".`,
      is_read: false, created_at: new Date().toISOString()
    }]).catch(() => {});
    fetchOrders();
    showAlert({ title: 'Order Cancelled', message: 'Your order has been cancelled.', type: 'info' });
  };

  const handleConfirmReceipt = async (order) => {
    const ok = await showConfirm({
      title: '⚠️ Confirm Item Received?',
      message: `This permanently releases GH₵${(Number(order.total) - ESCROW_FEE).toFixed(2)} to the seller. Only confirm if you've physically received "${order.title}". This is irreversible.`,
      confirmText: 'Yes, Release Funds',
      type: 'danger',
    });
    if (!ok) return;
    const { error } = await supabase.from('transactions').update({ status: 'payout_sent' }).eq('id', order.id);
    if (error) { showAlert({ title: 'Error', message: error.message, type: 'error' }); return; }
    // Notify seller
    await supabase.from('notifications').insert([{
      user_id: order.sellerId, type: 'payout_sent',
      message: `Buyer confirmed receipt of "${order.title}". Funds have been released to you!`,
      is_read: false, created_at: new Date().toISOString()
    }]).catch(() => {});
    fetchOrders();
    const leaveReview = await showConfirm({
      title: '🎉 Funds Released!',
      message: `GH₵${(Number(order.total) - ESCROW_FEE).toFixed(2)} sent to the seller. Would you like to leave a review?`,
      confirmText: 'Leave Review', cancelText: 'Later', type: 'success',
    });
    if (leaveReview) {
      window.location.hash = `#leave-review?sellerId=${order.sellerId}&sellerName=${encodeURIComponent(order.seller)}&productId=${order.productId}&itemName=${encodeURIComponent(order.title)}`;
    }
  };

  const filtered = liveOrders.filter(o => o.category === activeCategory && o.status === activeStatus);
  const sorted = [...filtered].sort((a, b) => sortOrder === 'desc' ? b.rawDate - a.rawDate : a.rawDate - b.rawDate);

  if (!currentUser) {
    return (
      <div style={{ ...S.empty, paddingTop: 80 }}>
        <BagIcon />
        <p style={S.emptyTitle}>Not Logged In</p>
        <p style={S.emptySub}>Log in to see your orders.</p>
      </div>
    );
  }

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={() => window.location.hash = '#profile'}>
          <BackIcon />
        </button>
        <p style={S.headerTitle}>My Orders</p>
        <button style={{ ...S.backBtn, background: '#EAEFFF' }} onClick={fetchOrders} title="Refresh">
          <RefreshIcon size={20} color="#005DE3" />
        </button>
      </div>

      {/* Category tabs */}
      <div style={S.catTabs}>
        {['PURCHASE', 'RENT', 'TRADE'].map(cat => (
          <button key={cat}
            style={{ ...S.catTab, ...(activeCategory === cat ? S.catTabActive : {}) }}
            onClick={() => { setActiveCategory(cat); setIsSelectMode(false); setSelectedOrders([]); }}>
            {cat === 'PURCHASE' ? 'Purchases' : cat === 'RENT' ? 'Rentals' : 'Trades'}
          </button>
        ))}
      </div>

      {/* Status chips */}
      <div style={S.statusRow}>
        {['ONGOING', 'COMPLETED', 'CANCELLED'].map(s => (
          <button key={s}
            style={{ ...S.statusChip, ...(activeStatus === s ? S.statusChipActive : {}) }}
            onClick={() => { setActiveStatus(s); setIsSelectMode(false); setSelectedOrders([]); }}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={S.controlRow}>
        {!isSelectMode ? (
          <>
            <button style={S.ctrlBtn} onClick={toggleSelectMode}>
              <CheckboxIcon size={16} /> Select to Remove
            </button>
            <button style={S.ctrlBtn} onClick={() => setSortOrder(p => p === 'desc' ? 'asc' : 'desc')}>
              {sortOrder === 'desc' ? <SortDownIcon size={16} /> : <SortUpIcon size={16} />}
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </>
        ) : (
          <>
            <button style={{ ...S.ctrlBtn, flex: 0.31 }} onClick={() => handleSelectAll(sorted)}>
              {selectedOrders.length === sorted.length && sorted.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            <button style={{ ...S.ctrlBtn, flex: 0.31, background: '#FEF2F2', borderColor: '#FCA5A5', color: '#EF4444' }} onClick={handleDeleteSelected}>
              Remove ({selectedOrders.length})
            </button>
            <button style={{ ...S.ctrlBtn, flex: 0.31 }} onClick={toggleSelectMode}>Cancel</button>
          </>
        )}
      </div>

      {/* List */}
      <div style={S.list}>
        {isLoading ? (
          <div style={S.spinner}>
            <div style={{ width: 36, height: 36, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : sorted.length === 0 ? (
          <div style={S.empty}>
            <BagIcon />
            <p style={S.emptyTitle}>No {activeStatus.toLowerCase()} {activeCategory.toLowerCase()}s</p>
            <p style={S.emptySub}>You don't have any orders in this section yet.</p>
          </div>
        ) : (
          sorted.map(order => {
            const isSelected = selectedOrders.includes(order.id);
            const badge = statusBadgeStyle(order.status);
            return (
              <div key={order.id} style={{ ...S.card, ...(isSelectMode && isSelected ? S.cardSelected : {}) }}
                onClick={() => {
                  if (isSelectMode) { toggleOrderSelection(order.id); return; }
                  window.location.hash = `#deal/${order.id}`;
                }}>

                <div style={S.cardHeader}>
                  <div style={S.sellerRow}>
                    <PersonIcon />
                    <p style={S.sellerName}>{order.seller}</p>
                  </div>
                  <div style={{ ...S.badge, background: badge.bg, color: badge.color }}>
                    {statusLabel(order.status, order.rawStatus)}
                  </div>
                </div>

                <div style={S.itemRow}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={order.image} alt={order.title} style={S.thumb} onError={e => { e.target.src = `https://picsum.photos/seed/${order.id}/150`; }} />
                    {isSelectMode && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: isSelected ? 'rgba(0,93,227,0.75)' : 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <CheckmarkCircleIcon size={24} color="#fff" />}
                      </div>
                    )}
                  </div>
                  <div style={S.itemInfo}>
                    <p style={S.itemTitle}>{order.title}</p>
                    <p style={S.itemPrice}>{order.price}</p>
                    <p style={S.itemDate}>Updated: {order.date}</p>
                  </div>
                </div>

                {!isSelectMode && (
                  <>
                    <div style={S.divider} />
                    <div style={S.actionRow}>
                      {order.status === 'ONGOING' && (
                        <button style={S.cancelBtn} onClick={e => { e.stopPropagation(); handleCancelOrder(order); }}>
                          Cancel Order
                        </button>
                      )}
                      {order.status === 'ONGOING' && order.rawStatus === 'accepted' && (
                        <button style={S.confirmBtn} onClick={e => { e.stopPropagation(); handleConfirmReceipt(order); }}>
                          <CheckmarkCircleIcon size={16} /> Confirm Received
                        </button>
                      )}
                      {order.status === 'COMPLETED' && (
                        <button style={S.reviewBtn} onClick={e => {
                          e.stopPropagation();
                          window.location.hash = `#leave-review?sellerId=${order.sellerId}&sellerName=${encodeURIComponent(order.seller)}&productId=${order.productId}&itemName=${encodeURIComponent(order.title)}`;
                        }}>
                          <StarIcon size={14} filled color="#F59E0B" /> Leave Review
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Bar */}
      {isSelectMode && (
        <div style={S.fab}>
          <button style={S.fabBtn} onClick={toggleSelectMode}>Cancel</button>
          <p style={S.fabTitle}>{selectedOrders.length} Selected</p>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }} onClick={handleDeleteSelected}>
            <TrashIcon size={24} color="#EF4444" />
          </button>
        </div>
      )}
    </div>
  );
}
