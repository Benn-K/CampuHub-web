import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import { useModal } from '../../components/modal/ModalContext';
import { supabase } from '../../supabaseClient';
import './checkout.css';

const PAYSTACK_PUBLIC_KEY = 'pk_test_5c3e799240b9edc15aaef1461c9c81d1154e63ef';
const ESCROW_FEE = 1.50;

// ===== ICONS =====
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const LocationIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ShieldCheckmarkIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);
const CashOutlineIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
  </svg>
);
const CubeOutlineIcon = ({ size = 48, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const LockClosedIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const SendIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const CheckmarkIcon = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const MessagesIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// Load Paystack inline script
function usePaystackScript() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.PaystackPop) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);
  return loaded;
}

export default function DealCheckoutPage() {
  const { showAlert, showConfirm } = useModal();
  const getProductById = useAppStore(s => s.getProductById);
  const clearCart = useAppStore(s => s.removeFromCart);
  const addOrder = useAppStore(s => s.addOrder);
  const currentUser = useAppStore(s => s.currentUser);
  const paystackLoaded = usePaystackScript();

  // Parse hash URL: #checkout?id=p1&action=trade
  const hash = window.location.hash;
  const matchAction = hash.match(/action=([^&]+)/);
  const matchId = hash.match(/id=([^&]+)/);
  const matchLocation = hash.match(/location=([^&]+)/);

  const action = matchAction ? matchAction[1] : 'buy';
  const productId = matchId ? matchId[1] : null;
  const passedLocation = matchLocation ? decodeURIComponent(matchLocation[1]) : null;
  const storeProduct = productId ? getProductById(productId) : null;

  const targetProduct = storeProduct ? {
    id: storeProduct.id,
    title: storeProduct.title,
    price: Number(String(storeProduct.price).replace(/[^0-9.]/g, '')) || 0,
    image_url: storeProduct.images?.[0] || storeProduct.image_url || storeProduct.image,
    location: passedLocation || storeProduct.location || 'Campus',
    seller_id: storeProduct.seller_id || storeProduct.sellerId,
  } : null;

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [rentDays, setRentDays] = useState('1');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeCash, setTradeCash] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('escrow');
  const [userInventory, setUserInventory] = useState([]);

  // Fetch user's own draft/live items for trade offer
  useEffect(() => {
    if (action === 'trade' && currentUser?.id) {
      supabase
        .from('products')
        .select('id, title, listing_type, condition, image_url, images')
        .eq('seller_id', currentUser.id)
        .then(({ data }) => setUserInventory(data || []));
    }
  }, [action, currentUser]);

  // ---- Price calculations ----
  const basePrice = targetProduct?.price || 0;
  const escrowFee = paymentMethod === 'escrow' ? ESCROW_FEE : 0;
  const validRentDays = Math.max(1, parseInt(rentDays) || 1);
  const tradeCashVal = parseFloat(tradeCash) || 0;

  let itemSubtotal = 0;
  if (action === 'buy')   itemSubtotal = basePrice;
  else if (action === 'rent') itemSubtotal = basePrice * validRentDays;
  else if (action === 'trade') itemSubtotal = tradeCashVal;

  const finalPayable = parseFloat((itemSubtotal + escrowFee).toFixed(2));
  const amountInKobo = Math.round(finalPayable * 100); // Paystack uses pesewas (subunit)

  // ---- DB helpers ----
  const insertTransaction = async (status) => {
    const { error } = await supabase.from('transactions').insert([{
      buyer_id: currentUser?.id,
      seller_id: targetProduct?.seller_id,
      product_id: targetProduct?.id,
      status: status,
      amount: parseFloat(itemSubtotal.toFixed(2)),
      created_at: new Date().toISOString(),
    }]);
    if (error) console.error('Transaction insert error:', error);
    return !error;
  };

  const insertNotification = async () => {
    if (!targetProduct?.seller_id) return;
    await supabase.from('notifications').insert([{
      user_id: targetProduct.seller_id,
      type: action === 'trade' ? 'trade_offer' : 'new_order',
      message: action === 'trade'
        ? `${currentUser?.name || 'A buyer'} wants to trade for your "${targetProduct.title}"`
        : `${currentUser?.name || 'A buyer'} just ${paymentMethod === 'cod' ? 'placed a COD order' : 'paid via Escrow'} for "${targetProduct.title}"`,
      is_read: false,
      created_at: new Date().toISOString(),
    }]).catch(e => console.error('Notification insert error:', e));
  };

  const onSuccess = async (status) => {
    await insertTransaction(status);
    await insertNotification();

    addOrder({
      id: `ord_${Date.now()}`,
      product: targetProduct,
      type: action,
      date: Date.now(),
      status: status === 'locked_in_escrow' ? 'Pending' : status === 'pending_cod' ? 'COD' : 'Trade Sent',
      total: finalPayable,
      tradeItemId: selectedTrade,
    });

    clearCart(targetProduct.id);
    setIsProcessing(false);

    await showAlert({
      title: '🎉 Deal Initiated!',
      message: status === 'locked_in_escrow'
        ? 'Payment secured in Escrow. The seller has been notified.'
        : status === 'pending_cod'
        ? 'Order confirmed! Pay the seller directly when you meet up.'
        : 'Your trade offer has been sent to the seller!',
      type: 'success',
      confirmText: 'View Active Deals',
    });

    window.location.hash = '#messages';
  };

  // ---- Paystack handler ----
  const launchPaystack = () => {
    if (!paystackLoaded || !window.PaystackPop) {
      showAlert({ title: 'Payment Not Ready', message: 'Payment system is loading. Please try again in a moment.', type: 'warning' });
      return;
    }
    if (!currentUser?.email) {
      showAlert({ title: 'Login Required', message: 'You must be logged in to make a payment.', type: 'error' });
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: currentUser.email,
      amount: amountInKobo,
      currency: 'GHS',
      channels: ['mobile_money', 'card'],
      ref: `campuhub_${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Product', variable_name: 'product', value: targetProduct?.title },
          { display_name: 'Action', variable_name: 'action', value: action },
          { display_name: 'Buyer', variable_name: 'buyer_id', value: currentUser?.id },
        ]
      },
      onSuccess: async (response) => {
        setIsProcessing(true);
        await onSuccess('locked_in_escrow');
      },
      onCancel: () => {
        setIsProcessing(false);
      },
    });
    handler.openIframe();
  };

  // ---- Main confirm handler ----
  const handleConfirm = async () => {
    if (!currentUser) {
      showAlert({ title: 'Login Required', message: 'You need to be logged in to complete this transaction.', type: 'info' });
      return;
    }
    if (action === 'trade' && !selectedTrade) {
      showAlert({ title: 'Select an Item', message: 'Please select one of your items to offer in this trade.', type: 'warning' });
      return;
    }

    // Trade with no cash topup → no payment needed
    if (action === 'trade' && tradeCashVal === 0) {
      setIsProcessing(true);
      await onSuccess('pending');
      return;
    }

    // COD → no online payment
    if (paymentMethod === 'cod') {
      const confirmed = await showConfirm({
        title: 'Confirm COD Order',
        message: `You agree to pay GH₵${itemSubtotal.toFixed(2)} directly to the seller upon meetup. No online payment required.`,
        confirmText: 'Confirm Order',
        type: 'confirm',
      });
      if (!confirmed) return;
      setIsProcessing(true);
      await onSuccess('pending_cod');
      return;
    }

    // Escrow → Paystack
    launchPaystack();
  };

  const getPageTitle = () => {
    if (action === 'buy')   return 'Secure Checkout';
    if (action === 'rent')  return 'Rental Request';
    return 'Make a Trade Offer';
  };

  // ---- Not found ----
  if (!targetProduct) {
    return (
      <div className="checkout-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#64748b', fontSize: 16 }}>Product not found.</p>
        <a href="#home" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Home</a>
      </div>
    );
  }

  return (
    <div className="ck-page">
      <div className="ck-inner">

        {/* ---- BREADCRUMB ---- */}
        <nav className="ck-breadcrumb">
          <a href={`#product/${targetProduct.id}`} className="ck-breadcrumb-link">
            <ArrowLeftIcon /> Back to Item
          </a>
          <span className="ck-breadcrumb-sep">›</span>
          <span className="ck-breadcrumb-current">{getPageTitle()}</span>
        </nav>

        {/* ---- HEADER ---- */}
        <div className="ck-page-header">
          <h1 className="ck-page-title">{getPageTitle()}</h1>
          <p className="ck-page-subtitle">
            {action === 'trade'
              ? 'Propose an exchange with the seller.'
              : 'Review your order and finalize your payment.'}
          </p>
        </div>

        <div className="ck-layout">

          {/* LEFT COLUMN */}
          <div className="ck-left">

            {/* Target Item */}
            <div className="ck-card ck-target-item">
              <img src={targetProduct.image_url} alt="Product" className="ck-target-img" />
              <div className="ck-target-details">
                <span className="ck-target-badge">
                  {action === 'buy' ? 'BUYING' : action === 'rent' ? 'RENTING' : 'TRADING FOR'}
                </span>
                <h3 className="ck-target-title">{targetProduct.title}</h3>
                <p className="ck-target-price">GH₵ {targetProduct.price.toFixed(2)}</p>
                <div className="ck-target-loc">
                  <LocationIcon size={14} color="#6B7280" />
                  <span>Meet at {targetProduct.location}</span>
                </div>
              </div>
            </div>

            {/* Meeting Arrangement */}
            <div className="ck-card">
              <h4 className="ck-card-title">Meeting Arrangement</h4>
              <div className="ck-location-row">
                <div className="ck-location-icon"><LocationIcon color="#005DE3" /></div>
                <div>
                  <p className="ck-location-label">Pickup Spot</p>
                  <p className="ck-location-val">{targetProduct.location}</p>
                </div>
              </div>
            </div>

            {/* RENT: Day Count */}
            {action === 'rent' && (
              <div className="ck-card">
                <h4 className="ck-card-title">Rental Duration</h4>
                <div className="ck-input-group">
                  <label className="ck-input-label">Number of Days</label>
                  <input
                    type="number"
                    className="ck-input"
                    placeholder="e.g. 5"
                    value={rentDays}
                    min="1"
                    onChange={e => setRentDays(e.target.value)}
                  />
                  <span className="ck-input-hint">
                    {validRentDays} day{validRentDays !== 1 ? 's' : ''} × GH₵{basePrice.toFixed(2)} = GH₵{(basePrice * validRentDays).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* TRADE: Inventory picker */}
            {action === 'trade' && (
              <>
                <div className="ck-card">
                  <h4 className="ck-card-title">Your Inventory</h4>
                  <p className="ck-card-sub">Select an item to offer in exchange.</p>

                  {userInventory.length === 0 ? (
                    <div className="ck-empty-state">
                      <CubeOutlineIcon color="#D1D5DB" />
                      <h4 className="ck-empty-title">Nothing to trade yet!</h4>
                      <p className="ck-empty-sub">Save items to your private stash to offer in trades.</p>
                      <button className="ck-empty-btn" onClick={() => window.location.hash = '#list'}>Add Items Now</button>
                    </div>
                  ) : (
                    userInventory.map(item => (
                      <div
                        key={item.id}
                        className={`ck-inventory-item ${selectedTrade === item.id ? 'active' : ''}`}
                        onClick={() => setSelectedTrade(item.id === selectedTrade ? null : item.id)}
                      >
                        <img
                          src={item.image_url || (item.images && item.images[0]) || 'https://picsum.photos/seed/trade/100'}
                          alt={item.title}
                          className="ck-inv-img"
                        />
                        <div className="ck-inv-text">
                          <h5 className="ck-inv-title">{item.title}</h5>
                          <p className="ck-inv-cond">{item.listing_type} • {item.condition}</p>
                        </div>
                        {selectedTrade === item.id && (
                          <div className="ck-inv-check"><CheckmarkIcon /></div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {userInventory.length > 0 && (
                  <div className="ck-card">
                    <h4 className="ck-card-title">Cash Top-Up (Optional)</h4>
                    <p className="ck-card-sub">Add cash if your item is worth less than theirs.</p>
                    <div className="ck-input-group">
                      <label className="ck-input-label">Additional Cash Offer</label>
                      <div className="ck-currency-input">
                        <span className="ck-currency-symbol">GH₵</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={tradeCash}
                          onChange={e => setTradeCash(e.target.value)}
                        />
                      </div>
                      <span className="ck-input-hint">If you add cash, it will be held in escrow until the trade is confirmed.</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Payment Method (Buy / Rent, or Trade with cash) */}
            {(action !== 'trade' || tradeCashVal > 0) && (
              <div className="ck-card">
                <h4 className="ck-card-title">Payment Method</h4>

                <div
                  className={`ck-payment-option ${paymentMethod === 'escrow' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('escrow')}
                >
                  <div className="ck-payment-icon"><ShieldCheckmarkIcon /></div>
                  <div className="ck-payment-text">
                    <h5 className="ck-payment-title">In-App Escrow</h5>
                    <p className="ck-payment-desc">Pay now. Funds are safely held by CampuHub until you confirm receipt. <strong>+GH₵{ESCROW_FEE.toFixed(2)} fee</strong></p>
                  </div>
                  <div className={`ck-radio ${paymentMethod === 'escrow' ? 'active' : ''}`}>
                    <div className="ck-radio-inner" />
                  </div>
                </div>

                {action !== 'trade' && (
                  <div
                    className={`ck-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="ck-payment-icon"><CashOutlineIcon /></div>
                    <div className="ck-payment-text">
                      <h5 className="ck-payment-title">Pay on Meetup (COD)</h5>
                      <p className="ck-payment-desc">Pay the seller directly when you meet. <strong>Escrow fee waived.</strong></p>
                    </div>
                    <div className={`ck-radio ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <div className="ck-radio-inner" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div>
            <div className="ck-card ck-summary-card">
              <h4 className="ck-card-title" style={{ paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>Order Summary</h4>

              <div className="ck-summary-row">
                <span className="ck-summary-label">
                  {action === 'rent'
                    ? `${targetProduct.title} × ${validRentDays} day${validRentDays !== 1 ? 's' : ''}`
                    : targetProduct.title}
                </span>
                <span className="ck-summary-val">
                  {action === 'trade' && tradeCashVal === 0
                    ? 'Trade Only'
                    : `GH₵ ${itemSubtotal.toFixed(2)}`}
                </span>
              </div>

              <div className="ck-summary-row">
                <span className="ck-summary-label">CampuHub Escrow Fee</span>
                <span className="ck-summary-val" style={{ color: escrowFee === 0 ? '#16a34a' : undefined }}>
                  {escrowFee === 0 ? (paymentMethod === 'cod' ? 'Waived (COD)' : 'Waived') : `GH₵ ${escrowFee.toFixed(2)}`}
                </span>
              </div>

              <div className="ck-summary-total" style={{ paddingTop: '16px', borderTop: '1px solid #F3F4F6', marginTop: '16px' }}>
                <span className="ck-total-label">Total Payable</span>
                <span className="ck-total-val">
                  {action === 'trade' && tradeCashVal === 0 ? 'No Payment' : `GH₵ ${finalPayable.toFixed(2)}`}
                </span>
              </div>

              <button
                className={`ck-confirm-btn action-${action}`}
                onClick={handleConfirm}
                disabled={isProcessing || (action === 'trade' && !selectedTrade)}
              >
                {isProcessing ? (
                  <div className="ck-spinner" />
                ) : (
                  <>
                    {action === 'trade' ? (
                      tradeCashVal > 0 ? (
                        <><ShieldCheckmarkIcon size={18} /> Lock GH₵{finalPayable.toFixed(2)} & Send Offer</>
                      ) : (
                        <><SendIcon size={18} /> Send Trade Offer</>
                      )
                    ) : paymentMethod === 'cod' ? (
                      'Confirm Order (Meetup)'
                    ) : (
                      <><ShieldCheckmarkIcon size={18} /> Pay GH₵{finalPayable.toFixed(2)} via Escrow</>
                    )}
                  </>
                )}
              </button>

              {paymentMethod === 'escrow' && finalPayable > 0 && (
                <div className="ck-escrow-notice">
                  <div className="ck-escrow-notice-icon"><LockClosedIcon size={18} /></div>
                  <p className="ck-escrow-text">
                    Your GH₵{finalPayable.toFixed(2)} is held securely by CampuHub until you confirm you've received the item.
                  </p>
                </div>
              )}

              {paymentMethod === 'escrow' && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
                  <span>Powered by</span>
                  <strong style={{ color: '#00c3f7' }}>Paystack</strong>
                  <span>· Channels: Card, Mobile Money</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
