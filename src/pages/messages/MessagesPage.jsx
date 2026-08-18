import React, { useState, useEffect, useCallback } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import './messages.css';

// ===== ICONS =====
const SearchIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const TrashIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const CartIcon = ({ size = 12, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const CalendarIcon = ({ size = 12, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const SwapIcon = ({ size = 12, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 8 16 13"/><line x1="21" y1="8" x2="9" y2="8"/><polyline points="8 21 3 16 8 11"/><line x1="3" y1="16" x2="15" y2="16"/>
  </svg>
);
const SendIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const InboxIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);
const DealIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ChevronRight = ({ size = 14, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const PackageIcon = ({ size = 40, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const SortIcon = ({ order = 'desc', size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {order === 'desc'
      ? <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
      : <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>}
  </svg>
);
const CheckmarkIcon = ({ size = 12, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const RefreshIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// Status mapping helper
const statusDisplay = (status, isBuyer) => {
  const normStatus = (status || '').toLowerCase();
  switch (normStatus) {
    case 'completed': 
    case 'payout_sent':
      return { label: 'Completed', color: '#3B82F6' }; // blue
    case 'accepted': 
      return { label: 'Accepted — Arrange Meetup', color: '#10B981' }; // green
    case 'locked_in_escrow':
      return isBuyer 
        ? { label: 'In Escrow — Waiting Seller', color: '#F59E0B' } // amber
        : { label: 'Action Required', color: '#EF4444' }; // red
    case 'pending':
      return isBuyer 
        ? { label: 'Pending Seller Approval', color: '#F59E0B' }
        : { label: 'New Order — Action Required', color: '#EF4444' };
    case 'pending_cod':
      return { label: 'COD — Pay on Meetup', color: '#8B5CF6' };
    case 'cancelled':
    case 'declined':
      return { label: 'Declined / Cancelled', color: '#6B7280' }; // gray
    default: 
      return { label: status || 'Unknown', color: '#6B7280' };
  }
};

const isActiveDeal = (rawStatus) => {
  const s = (rawStatus || '').toLowerCase();
  return !['completed', 'payout_sent', 'cancelled', 'declined'].includes(s);
};

export default function MessagesPage() {
  const { showAlert, showConfirm } = useModal();
  const currentUser = useAppStore(s => s.currentUser);
  const storeConversations = useAppStore(s => s.conversations);
  const sendMessageStore = useAppStore(s => s.sendMessage);

  // ─── Inbox state ───────────────────────────────────
  const [mainTab, setMainTab] = useState('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState('All');
  const [chatSortOrder, setChatSortOrder] = useState('desc');
  const [isChatSelectMode, setIsChatSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [liveChats, setLiveChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // ─── Fetch chats from Supabase ──────────────────
  const fetchChats = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingChats(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, text_content, created_at, is_read, sender_id, receiver_id,
          sender:sender_id(id, first_name, last_name, avatar_url),
          receiver:receiver_id(id, first_name, last_name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by other user
      const threads = {};
      (data || []).forEach(msg => {
        const isMe = msg.sender_id === currentUser.id;
        const otherUserId = isMe ? msg.receiver_id : msg.sender_id;
        const otherUser = isMe ? msg.receiver : msg.sender;
        
        if (!threads[otherUserId]) {
          threads[otherUserId] = {
            id: otherUserId,
            user: `${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`.trim() || 'Unknown User',
            avatar: otherUser?.avatar_url || `https://ui-avatars.com/api/?name=U&background=ccc&color=fff`,
            messages: [],
            unread: false,
            lastMsgTimeRaw: 0,
          };
        }
        
        threads[otherUserId].messages.push({
          id: msg.id,
          text: msg.text_content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawTime: new Date(msg.created_at).getTime(),
          fromMe: isMe
        });
        
        // Mark thread as unread if message was received and not yet read
        if (!isMe && !msg.is_read) {
          threads[otherUserId].unread = true;
        }
        
        threads[otherUserId].lastMsgTimeRaw = Math.max(threads[otherUserId].lastMsgTimeRaw, new Date(msg.created_at).getTime());
      });

      const mapped = Object.values(threads).sort((a, b) => b.lastMsgTimeRaw - a.lastMsgTimeRaw);
      setLiveChats(mapped);
      // Only auto-select first chat if nothing is selected yet
      if (mapped.length > 0 && !selectedChatId) {
        setSelectedChatId(mapped[0].id);
      }
    } catch (err) {
      console.error('Chats fetch error:', err);
    } finally {
      setIsLoadingChats(false);
    }
  }, [currentUser?.id]);

  // Always fetch on mount
  useEffect(() => { fetchChats(); }, [fetchChats]);

  useEffect(() => {
    if (mainTab === 'Inbox') fetchChats();
  }, [mainTab, fetchChats]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const channel = supabase.channel(`inbox_${currentUser.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUser.id}` }, () => { fetchChats(); })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${currentUser.id}` }, () => { fetchChats(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser?.id, fetchChats]);

  // ─── Deals state ───────────────────────────────────
  const [dealFilter, setDealFilter] = useState('All');
  const [dealStatusFilter, setDealStatusFilter] = useState('Active');
  const [dealSortOrder, setDealSortOrder] = useState('desc');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [liveDeals, setLiveDeals] = useState([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);

  // ─── Fetch deals from Supabase ─────────────────────
  const fetchDeals = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingDeals(true);
    try {
      // Fetch transactions
      const { data: txData, error } = await supabase
        .from('transactions')
        .select(`
          id, status, amount, created_at,
          buyer_id, seller_id, buyer_hidden, seller_hidden,
          products:product_id ( id, title, price, image_url, listing_type )
        `)
        .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Collect all unique counterparty IDs to fetch profiles for
      const counterpartyIds = [...new Set((txData || []).map(tx =>
        tx.buyer_id === currentUser.id ? tx.seller_id : tx.buyer_id
      ).filter(Boolean))];

      // Fetch profiles for all counterparties in one query
      let profileMap = {};
      if (counterpartyIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', counterpartyIds);
        (profileData || []).forEach(p => { profileMap[p.id] = p; });
      }

      const mapped = (txData || [])
        .filter(tx => {
          const isBuyer = tx.buyer_id === currentUser.id;
          return isBuyer ? !tx.buyer_hidden : !tx.seller_hidden;
        })
        .map(tx => {
          const isBuyer = tx.buyer_id === currentUser.id;
          const product = tx.products || {};
          const rawAction = (product.listing_type || 'buy').toUpperCase();
          const dealType = rawAction === 'RENT' ? 'RENT' : rawAction === 'TRADE' ? 'TRADE' : 'SELL';
          const { label, color } = statusDisplay(tx.status, isBuyer);
          const counterpartyId = isBuyer ? tx.seller_id : tx.buyer_id;
          const counterparty = profileMap[counterpartyId];
          const otherName = counterparty
            ? `${counterparty.first_name || ''} ${counterparty.last_name || ''}`.trim()
            : isBuyer ? 'Seller' : 'Buyer';
          const otherAvatar = counterparty?.avatar_url
            || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=${isBuyer ? '10B981' : '005DE3'}&color=fff`;
          return {
            id: tx.id,
            dealType,
            role: isBuyer ? 'buyer' : 'seller',
            user: otherName,
            avatar: otherAvatar,
            time: new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            itemTitle: product.title || 'Marketplace Item',
            itemPrice: product.price ? `GH₵ ${Number(product.price).toFixed(2)}` : 'N/A',
            itemImage: product.image_url || `https://picsum.photos/seed/${tx.id}/200`,
            dealStatus: label,
            statusColor: color,
            lastMessage: isBuyer ? 'You purchased this item' : 'New order received',
            rawDate: new Date(tx.created_at).getTime(),
            rawStatus: tx.status,
          };
        });
      setLiveDeals(mapped);
    } catch (err) {
      console.error('Deals fetch error:', err);
    } finally {
      setIsLoadingDeals(false);
    }
  }, [currentUser?.id]);


  // Always fetch deals on mount so badge count and data are ready immediately
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    if (mainTab === 'Deals') fetchDeals();
  }, [mainTab, fetchDeals]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const channel = supabase.channel(`deals_${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `buyer_id=eq.${currentUser.id}` }, () => { fetchDeals(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `seller_id=eq.${currentUser.id}` }, () => { fetchDeals(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser?.id, fetchDeals]);

  // Unread count
  const unreadCount = liveChats.filter(c => c.unread).length;
  const pendingDeals = liveDeals.filter(d => isActiveDeal(d.rawStatus)).length;

  // ─── Filter + sort: Inbox ──────────────────────────
  let activeChats = liveChats;
  if (searchQuery.trim()) {
    activeChats = activeChats.filter(c =>
      c.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.messages[0]?.text || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (chatFilter === 'Unread') activeChats = activeChats.filter(c => c.unread);
  const sortedChats = [...activeChats].sort((a, b) =>
    chatSortOrder === 'desc' ? b.lastMsgTimeRaw - a.lastMsgTimeRaw : a.lastMsgTimeRaw - b.lastMsgTimeRaw
  );

  // ─── Filter + sort: Deals ──────────────────────────
  const filteredDeals = liveDeals.filter(d => {
    if (dealFilter !== 'All' && d.dealType !== dealFilter) return false;
    if (dealStatusFilter === 'Active' && !isActiveDeal(d.rawStatus)) return false;
    if (dealStatusFilter === 'Completed' && d.rawStatus !== 'completed' && d.rawStatus !== 'payout_sent') return false;
    if (dealStatusFilter === 'Cancelled' && d.rawStatus !== 'cancelled' && d.rawStatus !== 'declined') return false;
    if (searchQuery.trim()) {
      return d.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });
  const sortedDeals = [...filteredDeals].sort((a, b) =>
    dealSortOrder === 'desc' ? b.rawDate - a.rawDate : a.rawDate - b.rawDate
  );

  const selectedChat = liveChats.find(c => c.id === selectedChatId);

  // ─── Inbox handlers ────────────────────────────────
  const handleSelectChat = (chatId) => {
    if (isChatSelectMode) { toggleChatSelection(chatId); return; }
    setSelectedChatId(chatId);
    setLiveChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: false } : c));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedChatId || !currentUser?.id) return;
    
    const newMsg = {
      sender_id: currentUser.id,
      receiver_id: selectedChatId, // selectedChatId is the otherUserId in our threads object
      text_content: replyText.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    setReplyText('');

    try {
      const { error } = await supabase.from('messages').insert([newMsg]);
      if (error) throw error;
      // fetchChats() is called by the realtime subscription automatically
    } catch (err) {
      console.error('Send error:', err);
      showAlert({ title: 'Error', message: 'Failed to send message.', type: 'error' });
    }
  };

  const toggleChatSelection = (id) => setSelectedChats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const cancelChatSelect = () => { setIsChatSelectMode(false); setSelectedChats([]); };
  const handleDeleteSelectedChats = async () => {
    if (!selectedChats.length) return;
    const ok = await showConfirm({ title: 'Delete Conversations?', message: `Remove ${selectedChats.length} conversation(s)? This cannot be undone.`, type: 'danger', confirmText: 'Delete' });
    if (!ok) return;
    setLiveChats(prev => prev.filter(c => !selectedChats.includes(c.id)));
    if (selectedChats.includes(selectedChatId)) setSelectedChatId(null);
    setSelectedChats([]);
    setIsChatSelectMode(false);
  };

  // ─── Deals handlers ────────────────────────────────
  const toggleDealSelection = (id) => setSelectedDeals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const cancelDealSelect = () => { setIsSelectMode(false); setSelectedDeals([]); };

  const handleHideSelectedDeals = async () => {
    if (!selectedDeals.length) return;
    const ok = await showConfirm({
      title: 'Hide Deals?',
      message: `Hide ${selectedDeals.length} deal(s) from your view? The transactions still exist in the database.`,
      type: 'warning',
      confirmText: 'Hide',
    });
    if (!ok) return;

    // Soft-delete: set buyer_hidden or seller_hidden per deal
    const updates = selectedDeals.map(dealId => {
      const deal = liveDeals.find(d => d.id === dealId);
      if (!deal) return Promise.resolve();
      const col = deal.role === 'buyer' ? 'buyer_hidden' : 'seller_hidden';
      return supabase.from('transactions').update({ [col]: true }).eq('id', dealId).catch(e => console.error('Hide deal error:', e));
    });
    await Promise.all(updates);

    // Optimistic UI update
    setLiveDeals(prev => prev.filter(d => !selectedDeals.includes(d.id)));
    setSelectedDeals([]);
    setIsSelectMode(false);
  };

  const dealTypeIcon = (type) => {
    if (type === 'SELL') return <CartIcon />;
    if (type === 'RENT') return <CalendarIcon />;
    return <SwapIcon />;
  };
  const dealTypeBg = (type) => {
    if (type === 'SELL') return '#4F46E5';
    if (type === 'RENT') return '#0EA5E9';
    return '#10B981';
  };

  return (
    <div className="msg-page">
      <div className="msg-inner">

        {/* ---- PAGE HEADER ---- */}
        <div className="msg-page-header">
          <div>
            <h1 className="msg-page-title">Messages</h1>
            <p className="msg-page-subtitle">
              {unreadCount > 0 ? `${unreadCount} unread conversation${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
        </div>

        {/* ---- MAIN TABS ---- */}
        <div className="msg-tabs">
          <button className={`msg-tab-btn ${mainTab === 'Inbox' ? 'active' : ''}`} onClick={() => { setMainTab('Inbox'); cancelDealSelect(); }}>
            <InboxIcon size={16} />
            <span>Inbox</span>
            {unreadCount > 0 && <span className="msg-tab-badge">{unreadCount}</span>}
          </button>
          <button className={`msg-tab-btn ${mainTab === 'Deals' ? 'active' : ''}`} onClick={() => { setMainTab('Deals'); cancelChatSelect(); }}>
            <DealIcon size={16} />
            <span>Active Deals</span>
            {pendingDeals > 0 && <span className="msg-tab-badge msg-tab-badge--red">{pendingDeals}</span>}
          </button>
        </div>

        {/* ---- INBOX LAYOUT ---- */}
        {mainTab === 'Inbox' && (
          <div className="msg-split-layout">
            {/* LEFT: Conversation List */}
            <div className="msg-sidebar">
              <div className="msg-sidebar-search">
                <SearchIcon size={16} color="#9CA3AF" />
                <input className="msg-sidebar-search-input" type="text" placeholder="Search conversations…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              <div className="msg-sidebar-toolbar">
                <div className="msg-filter-chips">
                  {['All', 'Unread'].map(f => (
                    <button key={f} className={`msg-chip ${chatFilter === f ? 'active' : ''}`} onClick={() => setChatFilter(f)}>
                      {f === 'All' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                    </button>
                  ))}
                </div>
                <div className="msg-toolbar-actions">
                  <button className="msg-toolbar-btn" onClick={() => setChatSortOrder(p => p === 'desc' ? 'asc' : 'desc')}>
                    <SortIcon order={chatSortOrder} /><span>{chatSortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                  </button>
                  {isChatSelectMode ? (
                    <>
                      <button className="msg-toolbar-btn msg-toolbar-btn--danger" onClick={handleDeleteSelectedChats} disabled={selectedChats.length === 0}>
                        <TrashIcon size={14} color="#EF4444" /><span>Delete{selectedChats.length > 0 ? ` (${selectedChats.length})` : ''}</span>
                      </button>
                      <button className="msg-toolbar-btn" onClick={cancelChatSelect}>Cancel</button>
                    </>
                  ) : (
                    <button className="msg-toolbar-btn" onClick={() => setIsChatSelectMode(true)}>
                      <TrashIcon size={14} color="#6B7280" /><span>Select</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="msg-convo-list">
                {sortedChats.length === 0 ? (
                  <div className="msg-empty">
                    <PackageIcon />
                    <p>No conversations yet</p>
                  </div>
                ) : sortedChats.map(chat => {
                  const isChatSelected = selectedChats.includes(chat.id);
                  return (
                    <button key={chat.id} className={`msg-convo-item ${selectedChatId === chat.id && !isChatSelectMode ? 'active' : ''} ${chat.unread ? 'unread' : ''} ${isChatSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectChat(chat.id)}
                      onContextMenu={e => { e.preventDefault(); setIsChatSelectMode(true); toggleChatSelection(chat.id); }}>
                      <div className="msg-convo-avatar-wrap">
                        {isChatSelectMode ? (
                          <div className={`msg-convo-checkbox ${isChatSelected ? 'checked' : ''}`}>
                            {isChatSelected && <CheckmarkIcon size={12} />}
                          </div>
                        ) : (
                          <img src={chat.avatar} alt={chat.user} className="msg-convo-avatar" />
                        )}
                        {!isChatSelectMode && chat.unread && <span className="msg-convo-unread-ring" />}
                      </div>
                      <div className="msg-convo-body">
                        <div className="msg-convo-top">
                          <span className="msg-convo-name">{chat.user}</span>
                          <span className="msg-convo-time">{chat.messages[chat.messages.length - 1]?.time}</span>
                        </div>
                        <p className="msg-convo-preview">{chat.messages[chat.messages.length - 1]?.text || 'Start a conversation'}</p>
                      </div>
                      {!isChatSelectMode && chat.unread && <span className="msg-convo-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Chat Window */}
            <div className="msg-chat-panel">
              {selectedChat ? (
                <>
                  <div className="msg-chat-header">
                    <button 
                      className="msg-mobile-back" 
                      onClick={() => handleSelectChat(null)}
                      style={{ border: 'none', background: 'none', fontSize: '24px', marginRight: '12px', cursor: 'pointer', display: 'none' }}
                    >
                      ←
                    </button>
                    <img src={selectedChat.avatar} alt={selectedChat.user} className="msg-chat-header-avatar" />
                    <div className="msg-chat-header-info">
                      <span className="msg-chat-header-name">{selectedChat.user}</span>
                      <span className="msg-chat-header-status">Active recently</span>
                    </div>
                  </div>

                  <div className="msg-chat-messages">
                    {(liveChats.find(c => c.id === selectedChatId)?.messages || []).map((msg, i) => {
                      const isMe = msg.fromMe === true;
                      return (
                        <div key={i} className={`msg-bubble-wrapper ${isMe ? 'msg-bubble-wrapper--me' : ''}`}>
                          {!isMe && <img src={selectedChat.avatar} className="msg-bubble-avatar" alt="" />}
                          <div className={`msg-bubble ${isMe ? 'msg-bubble--me' : ''}`}>{msg.text}</div>
                          <span className="msg-bubble-time">{msg.time}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="msg-chat-input-bar">
                    <input className="msg-chat-input" type="text" placeholder="Type a message…" value={replyText}
                      onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendReply()} />
                    <button className="msg-chat-send-btn" onClick={handleSendReply}><SendIcon size={18} color="#fff" /></button>
                  </div>
                </>
              ) : (
                <div className="msg-chat-empty">
                  <PackageIcon size={48} color="#D1D5DB" />
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---- DEALS LAYOUT ---- */}
        {mainTab === 'Deals' && (
          <div className="msg-deals-layout">
            <div className="msg-deals-controls">
              {/* Row 1: Type filter */}
              <div className="msg-filter-chips">
                {[
                  { key: 'All', label: 'All Types' },
                  { key: 'SELL', label: 'Sales' },
                  { key: 'RENT', label: 'Rentals' },
                  { key: 'TRADE', label: 'Trades' },
                ].map(f => (
                  <button key={f.key} className={`msg-chip ${dealFilter === f.key ? 'active' : ''}`} onClick={() => setDealFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              {/* Row 2: Status filter */}
              <div className="msg-filter-chips" style={{ marginTop: 8 }}>
                {[
                  { key: 'Active', label: '🟡 Active' },
                  { key: 'Completed', label: '✅ Completed' },
                  { key: 'Cancelled', label: '❌ Cancelled' },
                  { key: 'All', label: 'All Status' },
                ].map(f => (
                  <button key={f.key} className={`msg-chip ${dealStatusFilter === f.key ? 'active' : ''}`} onClick={() => setDealStatusFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="msg-toolbar-actions">
                <button className="msg-toolbar-btn" onClick={fetchDeals} title="Refresh">
                  <RefreshIcon size={14} /><span>Refresh</span>
                </button>
                <button className="msg-toolbar-btn" onClick={() => setDealSortOrder(p => p === 'desc' ? 'asc' : 'desc')}>
                  <SortIcon order={dealSortOrder} /><span>{dealSortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                </button>
                {isSelectMode ? (
                  <>
                    <button className="msg-toolbar-btn msg-toolbar-btn--danger" onClick={handleHideSelectedDeals} disabled={selectedDeals.length === 0}>
                      <TrashIcon size={14} color="#EF4444" /><span>Hide{selectedDeals.length > 0 ? ` (${selectedDeals.length})` : ''}</span>
                    </button>
                    <button className="msg-toolbar-btn" onClick={cancelDealSelect}>Cancel</button>
                  </>
                ) : (
                  <button className="msg-toolbar-btn" onClick={() => setIsSelectMode(true)}>
                    <TrashIcon size={14} color="#6B7280" /><span>Select</span>
                  </button>
                )}
              </div>
            </div>

            {isLoadingDeals ? (
              <div className="msg-empty">
                <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ marginTop: 12, color: '#6B7280' }}>Loading deals…</p>
              </div>
            ) : sortedDeals.length === 0 ? (
              <div className="msg-empty">
                <PackageIcon />
                <p>{dealStatusFilter === 'Active' ? 'No active deals' : 'No deals found'}</p>
                {dealStatusFilter === 'Active' && <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>When you purchase, rent, or trade an item it will appear here</p>}
                {!currentUser && <p style={{ fontSize: 13, color: '#9CA3AF' }}>Log in to see your deals</p>}
              </div>
            ) : (
              <div className="msg-deals-grid">
                {sortedDeals.map(deal => {
                  const isSelected = selectedDeals.includes(deal.id);
                  return (
                    <div key={deal.id} className={`msg-deal-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => isSelectMode ? toggleDealSelection(deal.id) : (window.location.hash = `#deal/${deal.id}`)}
                      onContextMenu={e => { e.preventDefault(); setIsSelectMode(true); toggleDealSelection(deal.id); }}>
                      <div className="msg-deal-thumb-wrap">
                        <img src={deal.itemImage} alt={deal.itemTitle} className="msg-deal-thumb"
                          onError={e => { e.target.src = `https://picsum.photos/seed/${deal.id}/200`; }} />
                        <span className="msg-deal-type-badge" style={{ background: dealTypeBg(deal.dealType) }}>
                          {dealTypeIcon(deal.dealType)}{deal.dealType}
                        </span>
                        {isSelectMode && (
                          <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: isSelected ? '#005DE3' : 'rgba(255,255,255,0.8)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSelected && <CheckmarkIcon size={12} />}
                          </div>
                        )}
                      </div>

                      <div className="msg-deal-info">
                        <div className="msg-deal-user-row">
                          <img src={deal.avatar} alt={deal.user} className="msg-deal-user-avatar" />
                          <span className="msg-deal-user-name">{deal.user}</span>
                          <span className="msg-deal-date">{deal.time}</span>
                        </div>
                        <p className="msg-deal-item-title">{deal.itemTitle}</p>
                        <p className="msg-deal-price">{deal.itemPrice}</p>
                        <div className="msg-deal-status-row">
                          <span className="msg-deal-status-dot" style={{ background: deal.statusColor }} />
                          <span className="msg-deal-status-text" style={{ color: deal.statusColor }}>{deal.dealStatus}</span>
                        </div>
                        <p className="msg-deal-last-msg">{deal.lastMessage}</p>
                      </div>

                      <div className="msg-deal-arrow"><ChevronRight size={16} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
