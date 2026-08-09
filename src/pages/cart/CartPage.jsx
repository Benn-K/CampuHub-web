import React, { useState } from 'react';
import './cart.css';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// Icons
const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CartEmptyIcon = ({ size = 64, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const HomeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShieldCheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const SendIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const MOCK_CART = []; // kept for fallback reference only

export default function CartPage() {
  const { showAlert, showAuthModal } = useModal();
  const cartEntries = useAppStore((s) => s.cart) || [];
  const removeFromCartStore = useAppStore((s) => s.removeFromCart);
  const currentUser = useAppStore((s) => s.currentUser);
  const [activeTab, setActiveTab] = useState('sell');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Map store entries { product, type } to the shape this page uses
  const cart = cartEntries.filter(entry => entry && entry.product).map((entry) => ({
    id: entry.product.id,
    title: entry.product.title || 'Unknown Item',
    price: Number(String(entry.product.price).replace(/[^0-9.]/g, '')) || 0,
    type: entry.type || 'sell',
    sellerName: entry.product.sellerName,
    sellerId: entry.product.seller_id || entry.product.sellerId,
    location: entry.product.location || 'Campus',
    image: entry.product.images?.[0] || entry.product.image_url || entry.product.image || 'https://via.placeholder.com/150',
  }));

  const filteredCart = cart.filter(item => {
    const safeType = item.type ? item.type.toLowerCase() : 'sell';
    return safeType === activeTab;
  });

  const calculateTotal = () => {
    return filteredCart.reduce((total, item) => total + (item.price || 0), 0);
  };

  const getTabCount = (tabName) => {
    return cart.filter(item => {
      const safeType = item.type ? item.type.toLowerCase() : 'sell';
      return safeType === tabName;
    }).length;
  };

  const removeFromCart = (id) => {
    removeFromCartStore(id);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      showAuthModal({
        title: 'Login Required',
        message: 'You need to be logged in to checkout. Create a free account or log into your existing one.',
      });
      return;
    }

    const firstItem = filteredCart[0];
    if (!firstItem) {
      showAlert({ title: 'Cart is Empty', message: 'Add some items to your cart before checking out.', type: 'warning' });
      return;
    }

    setIsCheckingOut(true);

    try {
      const status = activeTab === 'trade' ? 'pending' : 'locked_in_escrow';
      const actionStr = activeTab === 'rent' ? 'rent' : activeTab === 'trade' ? 'trade' : 'buy';
      
      const transactionsToInsert = filteredCart.map(item => ({
        buyer_id: currentUser.id,
        seller_id: item.sellerId,
        product_id: item.id,
        status: status,
        amount: item.price,
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('transactions').insert(transactionsToInsert);
      
      if (error) {
        throw error;
      }

      const notifications = filteredCart.map(item => {
        if (!item.sellerId) return null;
        return {
          user_id: item.sellerId,
          type: activeTab === 'trade' ? 'trade_offer' : 'new_order',
          message: activeTab === 'trade'
            ? `${currentUser.name || 'A buyer'} sent a trade offer for your "${item.title}"`
            : `${currentUser.name || 'A buyer'} just secured "${item.title}" in Escrow`,
          is_read: false,
          created_at: new Date().toISOString(),
        };
      }).filter(Boolean);

      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }

      // Clear checked-out items from cart
      filteredCart.forEach(item => {
        removeFromCartStore(item.id);
      });

      await showAlert({
        title: activeTab === 'trade' ? 'Trades Proposed!' : 'Checkout Successful!',
        message: activeTab === 'trade' 
          ? 'Your trade offers have been sent to the sellers.' 
          : 'Your items have been secured in Escrow.',
        type: 'success',
        confirmText: 'View Inbox',
      });

      window.location.hash = '#messages';
    } catch (error) {
      console.error('Bulk checkout error:', error);
      showAlert({ title: 'Checkout Failed', message: 'There was an issue processing your cart. Please try again.', type: 'error' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page-prof">
      <div className="cart-inner-prof">

        {/* ---- BREADCRUMB ---- */}
        <nav className="cart-breadcrumb-prof">
          <a href="#home" className="cart-breadcrumb-link-prof" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HomeIcon /> Home
          </a>
          <span className="cart-breadcrumb-sep-prof">›</span>
          <span className="cart-breadcrumb-current-prof">My Cart</span>
        </nav>

        {/* ---- HEADER ---- */}
        <div className="cart-page-header-prof">
          <h1 className="cart-page-title-prof">My Cart</h1>
          <p className="cart-page-subtitle-prof">
            Review your items and proceed to {activeTab === 'trade' ? 'propose trades' : 'checkout'}.
          </p>
        </div>

        {/* ---- LAYOUT ---- */}
        <div className="cart-layout-prof">

          {/* LEFT COLUMN: Tabs & List */}
          <div className="cart-left-prof">

            {/* Tabs */}
            <div className="cart-tabs-prof">
              {['sell', 'rent', 'trade'].map((tab) => {
                const itemCount = getTabCount(tab);
                return (
                  <button
                    key={tab}
                    className={`cart-tab-btn-prof ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'sell' ? 'Buy' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {itemCount > 0 && (
                      <span className="cart-tab-badge-prof">{itemCount}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* List */}
            {filteredCart.length === 0 ? (
              <div className="cart-empty-prof">
                <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <CartEmptyIcon />
                </div>
                <h2 className="cart-empty-title-prof">Your {activeTab === 'sell' ? 'Buy' : activeTab} cart is empty</h2>
                <p className="cart-empty-sub-prof">Items you want to {activeTab === 'sell' ? 'purchase' : activeTab} will appear here.</p>
              </div>
            ) : (
              <div className="cart-list-prof">
                {filteredCart.map(item => (
                  <div key={item.id} className="cart-item-prof">
                    <img src={item.image} alt={item.title} className="cart-item-img-prof" />
                    <div className="cart-item-details-prof">
                      <h3 className="cart-item-title-prof">{item.title}</h3>
                      <p className="cart-item-seller-prof">Seller: {item.sellerName || 'Verified Student'}</p>
                      {item.type === 'trade' ? (
                        <p className="cart-item-trade-prof">Pending Trade Offer</p>
                      ) : (
                        <p className="cart-item-price-prof">GH₵ {Number(item.price).toFixed(2)}</p>
                      )}
                    </div>
                    <button className="cart-item-remove-prof" onClick={() => removeFromCart(item.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Summary */}
          {filteredCart.length > 0 && (
            <div className="cart-summary-prof">
              <h3 className="cart-summary-title-prof">Order Summary</h3>

              <div className="cart-summary-row-prof">
                <span>Items ({filteredCart.length})</span>
                <span>{activeTab === 'trade' ? '-' : `GH₵ ${calculateTotal().toFixed(2)}`}</span>
              </div>

              <div className="cart-summary-row-prof">
                <span>Platform Fee</span>
                <span>{activeTab === 'trade' ? '-' : 'GH₵ 0.00'}</span>
              </div>

              <div className="cart-summary-total-prof">
                <span className="cart-summary-total-label-prof">Total Estimated</span>
                <span className="cart-summary-total-val-prof">
                  {activeTab === 'trade' ? '-' : `GH₵ ${calculateTotal().toFixed(2)}`}
                </span>
              </div>

              <button
                className="cart-checkout-btn-prof"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <div className="cart-spinner-prof" />
                ) : (
                  <>
                    {activeTab === 'trade' ? <SendIcon size={18} color="#fff" /> : null}
                    {activeTab === 'trade' ? 'Propose Trades' : 'Proceed to Checkout'}
                  </>
                )}
              </button>

              {activeTab !== 'trade' && (
                <div className="cart-secure-badge-prof">
                  <ShieldCheckIcon />
                  <span>Secure Escrow Checkout</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
