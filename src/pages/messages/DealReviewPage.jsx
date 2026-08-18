import React, { useState, useEffect } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import './deal.css';

// ===== ICONS =====
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const SwapIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
    <line x1="4" y1="4" x2="9" y2="9"/>
  </svg>
);
const CalendarIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const CartIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const CheckCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XCircleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const ClockIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ShieldIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const StarIcon = ({ size = 14, color = '#F59E0B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const CopyIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ESCROW_FEE = 1.50;

export default function DealReviewPage() {
  const { showAlert, showConfirm } = useModal();
  const currentUser = useAppStore(s => s.currentUser);

  // Parse deal id from hash: #deal/:id
  const hash = window.location.hash;
  const match = hash.match(/^#deal\/(.+)$/);
  const dealId = match ? match[1] : null;

  const [tx, setTx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch transaction from Supabase
  useEffect(() => {
    if (!dealId) { setIsLoading(false); return; }
    const fetchTx = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, status, amount, created_at,
          buyer_id, seller_id,
          products:product_id ( id, title, price, condition, image_url, location, listing_type ),
          buyer:buyer_id ( id, first_name, last_name, avatar_url ),
          seller:seller_id ( id, first_name, last_name, avatar_url, momo_number, momo_network )
        `)
        .eq('id', dealId)
        .single();

      if (error) { console.error('Deal fetch error:', error); setIsLoading(false); return; }
      setTx(data);
      setIsLoading(false);
    };
    fetchTx();
  }, [dealId]);

  const notifyUser = async (userId, type, message) => {
    try {
      await supabase.from('notifications').insert([{
        user_id: userId, type, message, is_read: false, created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.error('Notify error:', e);
    }
  };

  // ─── Seller: Accept Deal ────────────────────────────
  const handleAccept = async () => {
    const ok = await showConfirm({ title: 'Accept Deal?', message: 'This will notify the buyer to arrange a meetup. Are you sure?', confirmText: 'Accept', type: 'confirm' });
    if (!ok) return;
    setIsProcessing(true);
    const { error } = await supabase.from('transactions').update({ status: 'accepted' }).eq('id', dealId);
    if (error) { showAlert({ title: 'Error', message: error.message, type: 'error' }); setIsProcessing(false); return; }
    await notifyUser(tx.buyer_id, 'deal_accepted', `Your deal for "${tx.products?.title}" has been accepted! Arrange a meetup with the seller.`);
    setTx(prev => ({ ...prev, status: 'accepted' }));
    setIsProcessing(false);
    showAlert({ title: 'Deal Accepted!', message: 'The buyer has been notified. Arrange your meetup.', type: 'success' });
  };

  // ─── Seller: Decline Deal ───────────────────────────
  const handleDecline = async () => {
    const ok = await showConfirm({ title: 'Decline Deal?', message: 'This will notify the buyer that their offer was declined.', confirmText: 'Decline', type: 'danger' });
    if (!ok) return;
    setIsProcessing(true);
    const { error } = await supabase.from('transactions').update({ status: 'declined' }).eq('id', dealId);
    if (error) { showAlert({ title: 'Error', message: error.message, type: 'error' }); setIsProcessing(false); return; }
    await notifyUser(tx.buyer_id, 'deal_declined', `Your offer for "${tx.products?.title}" was declined by the seller.`);
    setTx(prev => ({ ...prev, status: 'declined' }));
    setIsProcessing(false);
  };

  // ─── Buyer: Confirm Receipt (Escrow Release) ────────
  const handleConfirmReceipt = async () => {
    const ok = await showConfirm({
      title: '⚠️ Confirm Item Received?',
      message: 'This will PERMANENTLY release the escrowed funds to the seller. Only confirm if you have physically received and inspected the item. This action cannot be undone.',
      confirmText: 'Yes, Release Funds',
      type: 'danger',
    });
    if (!ok) return;
    setIsProcessing(true);

    try {
      // 1. Update transaction status to payout_sent
      const { error: updateErr } = await supabase
        .from('transactions')
        .update({ status: 'payout_sent' })
        .eq('id', dealId);
      if (updateErr) throw updateErr;

      // 2. Notify the seller
      const netAmount = (Number(tx.total) - ESCROW_FEE).toFixed(2);
      await notifyUser(tx.seller_id, 'payout_sent',
        `Funds for "${tx.products?.title}" have been released! GH₵${netAmount} is on its way to your mobile money.`);

      setTx(prev => ({ ...prev, status: 'payout_sent' }));
      setIsProcessing(false);

      // 3. Prompt review
      const leaveReview = await showConfirm({
        title: '🎉 Transaction Complete!',
        message: `Funds released to the seller. Would you like to leave a review for ${tx.seller?.first_name || 'the seller'}?`,
        confirmText: 'Leave a Review',
        cancelText: 'Later',
        type: 'success',
      });
      if (leaveReview) {
        window.location.hash = `#leave-review?sellerId=${tx.seller_id}&sellerName=${encodeURIComponent(`${tx.seller?.first_name || ''} ${tx.seller?.last_name || ''}`.trim())}&productId=${tx.products?.id}&itemName=${encodeURIComponent(tx.products?.title || '')}`;
      }
    } catch (err) {
      setIsProcessing(false);
      showAlert({ title: 'Error', message: err.message || 'Could not release funds. Please try again.', type: 'error' });
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(dealId).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ─── Computed values ───────────────────────────────
  if (isLoading) {
    return (
      <div className="deal-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!tx) {
    // Fallback: try store orders
    return (
      <div className="deal-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#64748b', fontSize: 16 }}>Deal not found or you don't have permission to view it.</p>
        <a href="#messages" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Messages</a>
      </div>
    );
  }

  const role = tx.buyer_id === currentUser?.id ? 'buyer' : 'seller';
  const actionType = (tx.products?.listing_type || 'buy').toUpperCase();
  const type = actionType.includes('RENT') ? 'RENT' : actionType.includes('TRADE') ? 'TRADE' : 'SELL';
  const dealStatus = (tx.status || 'pending').toLowerCase();
  
  const escrowFee = dealStatus === 'pending_cod' ? 0 : ESCROW_FEE;
  const totalAmount = (Number(tx.amount || 0) + escrowFee).toFixed(2);
  const netToSeller = (Number(tx.amount || 0)).toFixed(2);

  const product = tx.products || {};
  const buyer = tx.buyer || {};
  const seller = tx.seller || {};

  const itemTitle = product.title || 'Marketplace Item';
  const itemPrice = product.price ? `GH₵ ${Number(product.price).toFixed(2)}` : 'N/A';
  const itemImage = product.image_url || `https://picsum.photos/seed/${tx.id}/400`;
  const itemCondition = product.condition || '';

  const counterparty = role === 'buyer' ? seller : buyer;
  const counterpartyName = `${counterparty.first_name || ''} ${counterparty.last_name || ''}`.trim() || (role === 'buyer' ? 'Seller' : 'Buyer');
  const counterpartyAvatar = counterparty.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpartyName)}&background=ccc&color=fff`;

  const dealTypeLabel = type === 'RENT' ? 'Rental' : type === 'TRADE' ? 'Trade' : 'Sale';
  const dealTypeBg    = type === 'RENT' ? '#0EA5E9' : type === 'TRADE' ? '#10B981' : '#4F46E5';
  const pageTitle     = type === 'RENT' ? 'Rental Request' : type === 'TRADE' ? 'Trade Offer' : 'Purchase Request';
  const actionLabel   = role === 'seller'
    ? (type === 'RENT' ? 'Wants to rent your item' : type === 'TRADE' ? 'Offered a trade' : 'Wants to buy your item')
    : (type === 'RENT' ? 'You requested to rent' : type === 'TRADE' ? 'You offered a trade' : 'You are purchasing');


  const statusMap = {
    pending: { label: 'Awaiting Response', color: '#F59E0B' },
    accepted: { label: 'Accepted', color: '#10B981' },
    locked_in_escrow: { label: 'In Escrow', color: '#3B82F6' },
    pending_cod: { label: 'COD — Pay on Meetup', color: '#8B5CF6' },
    completed: { label: 'Completed', color: '#059669' },
    payout_sent: { label: 'Payout Sent', color: '#059669' },
    declined: { label: 'Declined', color: '#EF4444' },
    cancelled: { label: 'Cancelled', color: '#EF4444' },
  };
  const statusInfo = statusMap[dealStatus] || { label: dealStatus, color: '#6B7280' };

  return (
    <div className="dr-page">
      <div className="dr-inner">

        {/* ---- BREADCRUMB ---- */}
        <nav className="dr-breadcrumb">
          <a href="#messages" className="dr-breadcrumb-link"><ArrowLeftIcon /> Messages</a>
          <span className="dr-breadcrumb-sep">›</span>
          <span className="dr-breadcrumb-current">{pageTitle}</span>
        </nav>

        {/* ---- PAGE HEADER ---- */}
        <div className="dr-page-header">
          <div>
            <h1 className="dr-page-title">{pageTitle}</h1>
            <p className="dr-page-subtitle">Review the terms below and take action on this deal.</p>
          </div>
          <span className="dr-type-badge" style={{ background: dealTypeBg }}>
            {type === 'RENT' ? <CalendarIcon size={13} color="#fff" /> : type === 'TRADE' ? <SwapIcon size={13} color="#fff" /> : <CartIcon size={13} color="#fff" />}
            {dealTypeLabel}
          </span>
        </div>

        {/* Status strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '10px 16px', background: '#F8F9FB', borderRadius: 12, border: '1px solid #F3F4F6' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusInfo.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: statusInfo.color, fontSize: 14 }}>{statusInfo.label}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF' }}>
            {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <button onClick={copyId} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}>
            <CopyIcon size={12} />{copied ? 'Copied!' : `ID: ${dealId.substring(0, 8).toUpperCase()}`}
          </button>
        </div>

        {/* ---- TWO COLUMN LAYOUT ---- */}
        <div className="dr-layout">

          {/* LEFT COLUMN */}
          <div className="dr-left">

            {/* Item Card */}
            <div className="dr-section-card">
              <p className="dr-section-label">Item</p>
              <div className="dr-item-row">
                <img src={itemImage} alt={itemTitle} className="dr-item-img" onError={e => { e.target.src = `https://picsum.photos/seed/${tx.id}/200`; }} />
                <div className="dr-item-info">
                  <h3 className="dr-item-title">{itemTitle}</h3>
                  {itemCondition && <span className="dr-item-condition">{itemCondition}</span>}
                  {type !== 'TRADE' && <p className="dr-item-price">{itemPrice}</p>}
                  {product.location && <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>📍 {product.location}</p>}
                </div>
              </div>
            </div>

            {/* Counterparty Card */}
            <div className="dr-section-card">
              <p className="dr-section-label">{role === 'seller' ? 'Buyer' : 'Seller'}</p>
              <div className="dr-party-row">
                <div className="dr-party-avatar-wrap">
                  <img src={counterpartyAvatar} alt={counterpartyName} className="dr-party-avatar" />
                  <span className="dr-party-type-dot" style={{ background: dealTypeBg }}>
                    {type === 'TRADE' ? <SwapIcon size={10} color="#fff" /> : type === 'RENT' ? <CalendarIcon size={10} color="#fff" /> : <CartIcon size={10} color="#fff" />}
                  </span>
                </div>
                <div className="dr-party-info">
                  <h4 className="dr-party-name">{counterpartyName}</h4>
                  <p className="dr-party-action">{actionLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="dr-right">

            {/* Transaction Details */}
            <div className="dr-section-card dr-terms-card">
              <p className="dr-section-label">Transaction Details</p>

              {type === 'RENT' && (
                <>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Rental Days</span>
                    <span className="dr-term-value">{tx.rent_days || 1} day{(tx.rent_days || 1) !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Total Value</span>
                    <span className="dr-term-value dr-term-blue">GH₵ {totalAmount}</span>
                  </div>
                </>
              )}

              {type === 'TRADE' && (
                <>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Listing</span>
                    <span className="dr-term-value">{itemTitle}</span>
                  </div>
                  {tx.trade_cash > 0 && (
                    <div className="dr-term-row">
                      <span className="dr-term-label">Cash Top-Up</span>
                      <span className="dr-term-value dr-term-orange">GH₵ {Number(tx.trade_cash).toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}

              {type === 'SELL' && (
                <>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Sale Price</span>
                    <span className="dr-term-value dr-term-green">{itemPrice}</span>
                  </div>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Payment Type</span>
                    <span className="dr-term-value">{dealStatus === 'pending_cod' ? 'Pay on Meetup (COD)' : 'In-App Escrow'}</span>
                  </div>
                </>
              )}

              {dealStatus !== 'pending_cod' && (
                <>
                  <div className="dr-term-row">
                    <span className="dr-term-label">Escrow Fee</span>
                    <span className="dr-term-value dr-term-muted">{escrowFee > 0 ? `GH₵ ${escrowFee}` : 'Waived'}</span>
                  </div>
                  <div className="dr-term-divider" />
                  <div className="dr-term-row">
                    <span className="dr-term-label dr-term-label-bold">Total Paid</span>
                    <span className="dr-term-value dr-term-dark">GH₵ {totalAmount}</span>
                  </div>
                  {role === 'seller' && (
                    <div className="dr-term-row">
                      <span className="dr-term-label dr-term-label-bold">You Receive</span>
                      <span className="dr-term-value dr-term-green">GH₵ {netToSeller}</span>
                    </div>
                  )}
                </>
              )}

              {dealStatus !== 'pending_cod' && (
                <div className="dr-escrow-badge">
                  <ShieldIcon size={14} color="#0284C7" />
                  <span>Funds held securely in CampuHub Escrow until buyer confirms receipt.</span>
                </div>
              )}
            </div>

            {/* ---- ACTION AREA ---- */}
            <div className="dr-action-card">

              {/* PENDING — Seller sees Accept/Decline */}
              {(dealStatus === 'pending' || dealStatus === 'locked_in_escrow') && role === 'seller' && (
                <>
                  <p className="dr-action-hint">Review the deal and respond to the buyer.</p>
                  <div className="dr-action-buttons">
                    <button className="dr-btn dr-btn-decline" onClick={handleDecline} disabled={isProcessing}>
                      {isProcessing ? 'Processing…' : 'Decline'}
                    </button>
                    <button className="dr-btn dr-btn-accept" onClick={handleAccept} disabled={isProcessing}>
                      {isProcessing ? 'Processing…' : 'Accept Deal'}
                    </button>
                  </div>
                </>
              )}

              {/* PENDING — Buyer waits */}
              {(dealStatus === 'pending' || dealStatus === 'locked_in_escrow') && role === 'buyer' && (
                <div className="dr-status-box dr-status-waiting">
                  <ClockIcon size={22} color="#D97706" />
                  <div>
                    <p className="dr-status-title">Awaiting Seller Response</p>
                    <p className="dr-status-sub">
                      {dealStatus !== 'pending_cod' ? 'Your payment is locked in escrow. ' : ''}
                      The seller is reviewing your offer. You'll be notified once they respond.
                    </p>
                  </div>
                </div>
              )}

              {/* COD PENDING — Buyer */}
              {dealStatus === 'pending_cod' && role === 'buyer' && (
                <div className="dr-status-box dr-status-waiting">
                  <ClockIcon size={22} color="#8B5CF6" />
                  <div>
                    <p className="dr-status-title">COD Order — Awaiting Meetup</p>
                    <p className="dr-status-sub">Coordinate with the seller to meet and complete the transaction. Pay them directly on meetup.</p>
                  </div>
                </div>
              )}

              {/* ACCEPTED — Buyer can confirm receipt */}
              {dealStatus === 'accepted' && role === 'buyer' && (
                <>
                  <div className="dr-status-box dr-status-success" style={{ marginBottom: 16 }}>
                    <CheckCircleIcon size={22} color="#059669" />
                    <div>
                      <p className="dr-status-title">Deal Accepted!</p>
                      <p className="dr-status-sub">Arrange your meetup and confirm once you've received and inspected the item.</p>
                    </div>
                  </div>
                  <button className="dr-btn dr-btn-complete" onClick={handleConfirmReceipt} disabled={isProcessing}>
                    <CheckCircleIcon size={18} color="#fff" />
                    {isProcessing ? 'Releasing Funds…' : 'Confirm Item Received'}
                  </button>
                </>
              )}

              {/* ACCEPTED — Seller waits */}
              {dealStatus === 'accepted' && role === 'seller' && (
                <div className="dr-status-box dr-status-success">
                  <CalendarIcon size={22} color="#059669" />
                  <div>
                    <p className="dr-status-title">Deal Accepted — Schedule Meetup</p>
                    <p className="dr-status-sub">Meet the buyer and hand over the item. Funds release once they confirm receipt.</p>
                  </div>
                </div>
              )}

              {/* COMPLETED / PAYOUT_SENT */}
              {(dealStatus === 'completed' || dealStatus === 'payout_sent') && (
                <div className="dr-completed-block">
                  <div className="dr-status-box dr-status-success">
                    <CheckCircleIcon size={22} color="#059669" />
                    <div>
                      <p className="dr-status-title">Deal Completed 🎉</p>
                      <p className="dr-status-sub">
                        {role === 'seller'
                          ? `GH₵${netToSeller} has been sent to your mobile money.`
                          : 'Transaction complete. Funds have been released to the seller.'}
                      </p>
                    </div>
                  </div>
                  {role === 'buyer' && (
                    <button className="dr-btn dr-btn-review"
                      onClick={() => window.location.hash = `#leave-review?sellerId=${tx.seller_id}&sellerName=${encodeURIComponent(counterpartyName)}&productId=${product.id}&itemName=${encodeURIComponent(itemTitle)}`}>
                      <StarIcon size={16} color="#F59E0B" /> Leave a Review
                    </button>
                  )}
                </div>
              )}

              {/* DECLINED */}
              {dealStatus === 'declined' && (
                <div className="dr-status-box dr-status-fail">
                  <XCircleIcon size={22} color="#DC2626" />
                  <div>
                    <p className="dr-status-title">Offer Declined</p>
                    <p className="dr-status-sub">This deal has been declined. You can browse other listings or send a new offer.</p>
                  </div>
                </div>
              )}

              {/* CANCELLED */}
              {dealStatus === 'cancelled' && (
                <div className="dr-status-box dr-status-fail">
                  <XCircleIcon size={22} color="#DC2626" />
                  <div>
                    <p className="dr-status-title">Deal Cancelled</p>
                    <p className="dr-status-sub">This transaction has been cancelled.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="dr-return">
              <a href="#messages" className="dr-return-link">← Return to Messages</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
