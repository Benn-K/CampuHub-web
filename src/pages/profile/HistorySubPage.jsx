import React, { useState, useEffect, useCallback } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const DownloadIcon = ({ size = 22, color = "#1A1F36" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
const ReceiptIcon = ({ size = 48, color = "#D1D5DB" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22l3-3 3 3 3-3 3 3 3-3 3 3 3-3v-16a2 2 0 0 0-2-2h-16a2 2 0 0 0-2 2z"></path>
    <line x1="6" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="6" y1="16" x2="12" y2="16"></line>
  </svg>
);
const HandRightIcon = ({ size = 18, color = "#D97706" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const ArrowDownIcon = ({ size = 18, color = "#10B981" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);
const ArrowUpIcon = ({ size = 18, color = "#4B5563" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);
const CopyIcon = ({ size = 12, color = "#9CA3AF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const S = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%', position: 'relative' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 15px' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0 },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAEFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: 'none' },
  filterRow: { display: 'flex', flexDirection: 'row', padding: '0 20px 15px', overflowX: 'auto' },
  filterChip: { padding: '8px 16px', borderRadius: 20, backgroundColor: '#fff', marginRight: 10, border: '1px solid #E5E7EB', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterChipActive: { backgroundColor: '#1A1F36', borderColor: '#1A1F36' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280', margin: 0 },
  filterTextActive: { color: '#fff' },
  scrollContent: { padding: '0 20px 40px' },
  statementHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, padding: '0 4px' },
  statementMonth: { fontSize: 16, fontWeight: '800', color: '#1A1F36', margin: 0 },
  statementSummary: { fontSize: 13, color: '#6B7280', fontWeight: '600', margin: 0 },
  listContainer: { backgroundColor: '#fff', borderRadius: 20, padding: '0 15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6' },
  txRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', background: 'transparent', width: '100%', textAlign: 'left', borderTop: 'none', borderLeft: 'none', borderRight: 'none' },
  iconBox: { width: 40, height: 40, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: 15, overflow: 'hidden' },
  txTitle: { fontSize: 15, fontWeight: '700', color: '#1A1F36', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  metaRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 4, overflow: 'hidden' },
  txDate: { fontSize: 12, color: '#6B7280', flexShrink: 0, margin: 0 },
  metaDot: { fontSize: 12, color: '#D1D5DB', margin: '0 6px', flexShrink: 0 },
  txMethod: { fontSize: 12, color: '#6B7280', fontWeight: '500', flexShrink: 1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  idRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F8F9FB', padding: '2px 6px', borderRadius: 6, cursor: 'pointer', border: 'none' },
  txId: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', fontFamily: 'monospace', margin: 0 },
  amountCol: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, paddingLeft: 10, minWidth: 85 },
  txAmount: { fontSize: 15, fontWeight: '800', margin: 0, whiteSpace: 'nowrap' },
  txPendingText: { fontSize: 10, fontWeight: '800', margin: '4px 0 0 0', padding: '2px 6px', borderRadius: 4, alignSelf: 'flex-end' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' },
  emptyTitle: { margin: '15px 0 0 0', fontSize: 16, color: '#1A1F36', fontWeight: '800' },
  emptySub: { margin: '5px 0 0 0', fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: '20px' },
};

export default function HistorySubPage() {
  const user = useAppStore(s => s.currentUser);
  const { showAlert } = useModal();
  
  const [filter, setFilter] = useState('All');
  const [liveHistory, setLiveHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, status, amount, created_at,
          buyer_id, seller_id,
          products:product_id ( title, listing_type )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTxs = (data || []).map(tx => {
        const isSeller = tx.seller_id === user.id;
        const dbStatus = (tx.status || '').toUpperCase();
        const productTitle = tx.products?.title || 'Marketplace Item';
        const dateObj = new Date(tx.created_at);
        const dateStr = `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

        let method = 'System';
        let title = isSeller ? `Sold: ${productTitle}` : `Bought: ${productTitle}`;
        let uiStatus = dbStatus;

        if (dbStatus === 'PENDING_COD') {
          method = 'Pay on Meetup';
          uiStatus = 'COD_PENDING';
        } else if (dbStatus === 'LOCKED_IN_ESCROW') {
          method = 'In-App Escrow';
        } else if (dbStatus === 'PAYOUT_SENT' || dbStatus === 'COMPLETED') {
          method = isSeller ? 'Escrow Payout' : 'In-App Escrow';
          uiStatus = 'COMPLETED';
        } else if (dbStatus === 'DECLINED' || dbStatus === 'CANCELLED') {
          method = 'System Refund';
          title = `Cancelled: ${productTitle}`;
        } else {
          method = 'In-App Escrow';
        }

        const displayAmount = Number(tx.amount || 0).toFixed(2);

        return {
          id: tx.id,
          title,
          date: dateStr,
          rawDate: dateObj.getTime(),
          amount: displayAmount,
          type: isSeller ? 'IN' : 'OUT', 
          method,
          status: uiStatus
        };
      });

      setLiveHistory(mappedTxs);
    } catch (err) {
      console.error('History fetch error:', err);
      showAlert({ title: 'Error', message: err.message || 'Could not fetch history.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filteredHistory = liveHistory.filter(tx => {
    if (filter === 'All') return true;
    if (filter === 'Meetup') return tx.method === 'Pay on Meetup';
    if (filter === 'Money In') return tx.type === 'IN' && tx.method !== 'Pay on Meetup';
    if (filter === 'Money Out') return tx.type === 'OUT' && tx.method !== 'Pay on Meetup';
    return true;
  });

  const copyToClipboard = (e, txId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(txId).then(() => {
      showAlert({ title: 'Copied!', message: `Transaction ID ${txId.substring(0, 8).toUpperCase()} copied.`, type: 'success' });
    });
  };

  const showReceipt = (tx) => {
    showAlert({
      title: 'Transaction Receipt',
      message: `ID: ${tx.id}\nDate: ${tx.date}\nAmount: GH₵ ${tx.amount}\nMethod: ${tx.method}\nStatus: ${tx.status}`,
      type: 'info'
    });
  };

  if (!user) return (
    <div style={S.container}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={S.headerTitle}>Transaction History</p>
        <div style={{ width: 40 }} />
      </div>
      <div style={S.emptyState}>
        <p style={S.emptyTitle}>Log in to view history</p>
      </div>
    </div>
  );

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={() => window.location.hash = '#profile'}>
          <ArrowBackIcon />
        </button>
        <p style={S.headerTitle}>Transaction History</p>
        <button style={S.downloadBtn} onClick={() => showAlert({ title: 'Export', message: 'Statement downloaded as PDF.', type: 'success' })}>
          <DownloadIcon />
        </button>
      </div>

      {/* Filters */}
      <div style={S.filterRow}>
        {['All', 'Money In', 'Money Out', 'Meetup'].map((f) => (
          <button 
            key={f} 
            style={{ ...S.filterChip, ...(filter === f ? S.filterChipActive : {}) }}
            onClick={() => setFilter(f)}
          >
            <p style={{ ...S.filterText, ...(filter === f ? S.filterTextActive : {}) }}>{f}</p>
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div style={{ width: 36, height: 36, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={S.scrollContent}>
            
            <div style={S.statementHeader}>
              <p style={S.statementMonth}>Recent Records</p>
              <p style={S.statementSummary}>
                {filteredHistory.length} {filteredHistory.length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>

            <div style={S.listContainer}>
              {filteredHistory.length === 0 ? (
                <div style={S.emptyState}>
                  <ReceiptIcon />
                  <p style={S.emptyTitle}>No transactions</p>
                  <p style={S.emptySub}>You don't have any records matching this filter.</p>
                </div>
              ) : (
                filteredHistory.map((tx, index) => {
                  const isLast = index === filteredHistory.length - 1;
                  const isIn = tx.type === 'IN';
                  const isMeetup = tx.method === 'Pay on Meetup'; 
                  const isPending = ['PENDING', 'ACCEPTED', 'LOCKED_IN_ESCROW', 'COD_PENDING'].includes(tx.status);

                  return (
                    <button 
                      key={tx.id} 
                      style={{ ...S.txRow, ...(isLast ? { borderBottom: 'none' } : {}) }}
                      onClick={() => showReceipt(tx)}
                    >
                      <div style={{ ...S.iconBox, backgroundColor: isMeetup ? '#FEF3C7' : isIn ? '#ECFDF5' : '#F3F4F6' }}>
                        {isMeetup ? <HandRightIcon /> : isIn ? <ArrowDownIcon /> : <ArrowUpIcon />}
                      </div>

                      <div style={S.txInfo}>
                        <p style={S.txTitle}>{tx.title}</p>
                        
                        <div style={S.metaRow}>
                          <p style={S.txDate}>{tx.date}</p>
                          <p style={S.metaDot}>•</p>
                          <p style={S.txMethod}>{tx.method}</p>
                        </div>

                        <button style={S.idRow} onClick={(e) => copyToClipboard(e, tx.id)}>
                          <p style={S.txId}>ID: {tx.id.substring(0, 8).toUpperCase()}</p>
                          <CopyIcon />
                        </button>
                      </div>

                      <div style={S.amountCol}>
                        <p style={{ ...S.txAmount, color: isMeetup ? '#D97706' : isIn ? '#10B981' : '#1A1F36' }}>
                          {isMeetup ? '' : (isIn ? '+' : '-')}GH₵ {tx.amount}
                        </p>
                        
                        {isMeetup ? (
                          <p style={{ ...S.txPendingText, color: '#D97706', backgroundColor: '#FEF3C7' }}>Pay in Person</p>
                        ) : isPending ? (
                          <p style={{ ...S.txPendingText, color: '#3B82F6', backgroundColor: '#EFF6FF' }}>Pending</p>
                        ) : null}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
