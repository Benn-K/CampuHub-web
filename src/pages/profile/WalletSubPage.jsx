import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';

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
  } else if (name === 'information-circle-outline') {
    iconContent = <><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></>;
  } else if (name === 'lock-closed') {
    iconContent = <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>;
  } else if (name === 'cash-outline') {
    iconContent = <><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></>;
  } else if (name === 'phone-portrait-outline') {
    iconContent = <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></>;
  } else if (name === 'help-buoy-outline') {
    iconContent = <><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></>;
  } else if (name === 'shield-checkmark') {
    iconContent = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></>;
  } else if (name === 'hand-right') {
    iconContent = <><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></>;
  } else if (name === 'arrow-down') {
    iconContent = <><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></>;
  } else if (name === 'arrow-up') {
    iconContent = <><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></>;
  } else if (name === 'refresh') {
    iconContent = <><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></>;
  } else if (name === 'wallet') {
    iconContent = <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5H5v-2h16V9H5a2 2 0 0 0-2 2v1"></path></>;
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
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: 'none' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1F36', margin: 0 },
  
  scrollContent: { paddingLeft: 20, paddingRight: 20, paddingBottom: 40 },
  
  walletCard: { backgroundColor: '#005DE3', borderRadius: 24, padding: 25, marginBottom: 20, boxShadow: '0 8px 15px rgba(0, 93, 227, 0.3)' },
  walletHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  walletLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', margin: 0 },
  availableBalance: { color: '#fff', fontSize: 36, fontWeight: '900', marginBottom: 20, letterSpacing: '-1px', margin: '0 0 20px 0' },
  escrowRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 12, alignSelf: 'flex-start', width: 'fit-content' },
  escrowIconBox: { marginRight: 8, display: 'flex' },
  escrowText: { color: '#fff', fontSize: 12, fontWeight: '600', margin: 0 },
  
  actionGrid: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', paddingTop: 15, paddingBottom: 15, borderRadius: 20, marginLeft: 4, marginRight: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.03)', cursor: 'pointer', border: 'none' },
  actionIconBox: { width: 48, height: 48, borderRadius: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#1A1F36', margin: 0 },
  
  securityBanner: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 15, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderStyle: 'solid', borderColor: '#D1FAE5' },
  securityTextCol: { flex: 1, marginLeft: 12 },
  securityTitle: { fontSize: 14, fontWeight: '800', color: '#065F46', marginBottom: 4, margin: '0 0 4px 0' },
  securitySub: { fontSize: 12, color: '#047857', lineHeight: '18px', margin: 0 },
  
  historyHeader: { marginBottom: 15 },
  historyTitle: { fontSize: 18, fontWeight: '800', color: '#1A1F36', margin: 0 },
  
  filterRow: { display: 'flex', flexDirection: 'row', marginBottom: 15, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' },
  filterChip: { paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterChipActive: { backgroundColor: '#1A1F36', borderColor: '#1A1F36' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280', margin: 0 },
  filterTextActive: { color: '#fff' },
  
  transactionList: { backgroundColor: '#fff', borderRadius: 20, padding: 15, boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  txCard: { display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomStyle: 'solid', borderColor: '#F3F4F6' },
  txIconBox: { width: 44, height: 44, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  txTitle: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 2, margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  txItem: { fontSize: 12, color: '#6B7280', marginBottom: 4, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  txDate: { fontSize: 11, color: '#9CA3AF', fontWeight: '500', margin: 0 },
  
  txAmountCol: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' },
  txAmount: { fontSize: 14, fontWeight: '800', margin: 0 },
  txPendingText: { fontSize: 10, color: '#F59E0B', fontWeight: '800', marginTop: 4, backgroundColor: '#FEF3C7', paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4, margin: '4px 0 0 0' },
  
  emptyState: { paddingTop: 30, paddingBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500', margin: 0 }
};

export default function WalletSubPage() {
  const user = useAppStore((state) => state.currentUser);
  
  const [filter, setFilter] = useState('All');
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWalletData = async () => {
      setIsLoading(true);
      
      // Mock API delay
      await new Promise(res => setTimeout(res, 800));

      const mockData = [
        { id: '1', created_at: new Date().toISOString(), status: 'LOCKED_IN_ESCROW', seller_id: 's2', buyer_id: user.id, amount: 150.00, products: { title: 'Calculus Textbook' } },
        { id: '2', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'PAYOUT_SENT', seller_id: user.id, buyer_id: 'b1', amount: 400.00, products: { title: 'Mini Fridge' } },
        { id: '3', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'DECLINED', seller_id: 's3', buyer_id: user.id, amount: 25.00, products: { title: 'USB-C Cable' } }
      ];

      let calcEscrow = 0;
      let calcAvailable = 450.50; // Mock base available balance

      const mappedTxs = mockData.map((tx) => {
        const isSeller = tx.seller_id === user.id;
        const status = (tx.status || '').toUpperCase();
        const productTitle = tx.products?.title || 'Marketplace Item';
        
        const dateObj = new Date(tx.created_at);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        let type = 'UNKNOWN';
        let title = 'Transaction';
        let isPositive = false;

        if (status === 'LOCKED_IN_ESCROW') {
          type = 'ESCROW_LOCKED';
          title = isSeller ? 'Funds Locked in Escrow' : 'Payment Sent to Escrow';
          isPositive = isSeller;
          if (isSeller) calcEscrow += tx.amount;
        } else if (status === 'PENDING_COD') {
          type = 'COD_PENDING';
          title = isSeller ? 'Pending Meetup (To Receive)' : 'Pending Meetup (To Pay)';
          isPositive = isSeller;
        } else if (status === 'PAYOUT_SENT' || status === 'COMPLETED') {
          type = 'PAYOUT';
          title = isSeller ? 'Payout Released' : 'Payment Completed';
          isPositive = isSeller;
        } else if (status === 'DECLINED' || status === 'CANCELLED') {
          type = 'REFUND';
          title = isSeller ? 'Deal Cancelled' : 'Refund Issued';
          isPositive = !isSeller; 
        }

        return {
          id: tx.id,
          title,
          item: productTitle,
          amount: `GH₵ ${tx.amount.toFixed(2)}`,
          date: dateStr,
          type,
          isPositive
        };
      });

      setLiveTransactions(mappedTxs);
      setEscrowBalance(calcEscrow);
      setAvailableBalance(calcAvailable);
      
      setIsLoading(false);
    };

    fetchWalletData();
  }, [user?.id]);

  const handleWithdraw = () => {
    if (window.confirm(`Withdraw Funds\n\nWithdraw GH₵ ${availableBalance.toFixed(2)} to your linked Mobile Money account?`)) {
      window.alert("Success\nWithdrawal initiated. It will reflect in your MoMo wallet shortly.");
    }
  };

  const handlePaymentMethods = () => {
    window.alert("Payment Methods\nManage your Mobile Money numbers and Bank Cards here.");
  };

  const filteredTransactions = liveTransactions.filter(tx => {
    if (filter === 'All') return true;
    if (filter === 'Escrow' && tx.type === 'ESCROW_LOCKED') return true;
    if (filter === 'Payouts' && (tx.type === 'PAYOUT' || tx.type === 'WITHDRAWAL')) return true;
    if (filter === 'Meetup' && tx.type === 'COD_PENDING') return true; 
    return false;
  });

  const getIconForType = (type) => {
    switch(type) {
      case 'ESCROW_LOCKED': return { name: 'lock-closed', color: '#F59E0B', bg: '#FEF3C7' };
      case 'COD_PENDING': return { name: 'hand-right', color: '#D97706', bg: '#FEF3C7' }; 
      case 'PAYOUT': return { name: 'arrow-down', color: '#10B981', bg: '#ECFDF5' };
      case 'WITHDRAWAL': return { name: 'arrow-up', color: '#1A1F36', bg: '#F3F4F6' };
      case 'REFUND': return { name: 'refresh', color: '#005DE3', bg: '#EAEFFF' };
      default: return { name: 'wallet', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F36" />
        </button>
        <p style={styles.headerTitle}>Escrow & Wallet</p>
        <div style={{ width: 40 }} />
      </div>

      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={styles.scrollContent}>
            
            {/* Wallet Balance Card */}
            <div style={styles.walletCard}>
              <div style={styles.walletHeader}>
                <p style={styles.walletLabel}>Available Balance</p>
                <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <p style={styles.availableBalance}>GH₵ {availableBalance.toFixed(2)}</p>
              
              <div style={styles.escrowRow}>
                <div style={styles.escrowIconBox}>
                  <Ionicons name="lock-closed" size={14} color="#fff" />
                </div>
                <p style={styles.escrowText}>GH₵ {escrowBalance.toFixed(2)} locked safely in Escrow</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionGrid}>
              <button style={styles.actionBtn} onClick={handleWithdraw}>
                <div style={{ ...styles.actionIconBox, backgroundColor: '#ECFDF5' }}>
                  <Ionicons name="cash-outline" size={24} color="#10B981" />
                </div>
                <p style={styles.actionBtnText}>Withdraw</p>
              </button>

              <button style={styles.actionBtn} onClick={handlePaymentMethods}>
                <div style={{ ...styles.actionIconBox, backgroundColor: '#EAEFFF' }}>
                  <Ionicons name="phone-portrait-outline" size={24} color="#005DE3" />
                </div>
                <p style={styles.actionBtnText}>MoMo / Cards</p>
              </button>

              <button style={styles.actionBtn} onClick={() => window.alert("Support\nNeed help with a payment?")}>
                <div style={{ ...styles.actionIconBox, backgroundColor: '#FEF2F2' }}>
                  <Ionicons name="help-buoy-outline" size={24} color="#FF4757" />
                </div>
                <p style={styles.actionBtnText}>Support</p>
              </button>
            </div>

            {/* Security Banner */}
            <div style={styles.securityBanner}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <div style={styles.securityTextCol}>
                <p style={styles.securityTitle}>100% Protected Payments</p>
                <p style={styles.securitySub}>Funds are only released when both students confirm the meetup is successful.</p>
              </div>
            </div>

            {/* Transaction History Section */}
            <div style={styles.historyHeader}>
              <p style={styles.historyTitle}>Recent Activity</p>
            </div>

            {/* Filters */}
            <div style={styles.filterRow}>
              {['All', 'Escrow', 'Payouts', 'Meetup'].map((f) => (
                <button 
                  key={f} 
                  style={{ ...styles.filterChip, ...(filter === f ? styles.filterChipActive : {}) }}
                  onClick={() => setFilter(f)}
                >
                  <p style={{ ...styles.filterText, ...(filter === f ? styles.filterTextActive : {}) }}>{f}</p>
                </button>
              ))}
            </div>

            {/* Transactions List */}
            <div style={styles.transactionList}>
              {filteredTransactions.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No transactions found for this filter.</p>
                </div>
              ) : (
                filteredTransactions.map(tx => {
                  const iconData = getIconForType(tx.type);
                  return (
                    <div key={tx.id} style={styles.txCard}>
                      <div style={{ ...styles.txIconBox, backgroundColor: iconData.bg }}>
                        <Ionicons name={iconData.name} size={20} color={iconData.color} />
                      </div>
                      
                      <div style={styles.txInfo}>
                        <p style={styles.txTitle}>{tx.title}</p>
                        <p style={styles.txItem}>{tx.item}</p>
                        <p style={styles.txDate}>{tx.date}</p>
                      </div>

                      <div style={styles.txAmountCol}>
                        <p style={{ ...styles.txAmount, color: tx.isPositive ? '#10B981' : '#1A1F36' }}>
                          {tx.isPositive ? '+' : ''}{tx.amount}
                        </p>
                        
                        {tx.type === 'ESCROW_LOCKED' && (
                          <p style={styles.txPendingText}>Pending Escrow</p>
                        )}
                        {tx.type === 'COD_PENDING' && (
                          <p style={{ ...styles.txPendingText, color: '#D97706', backgroundColor: '#FEF3C7' }}>Pay in Person</p>
                        )}
                      </div>
                    </div>
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
