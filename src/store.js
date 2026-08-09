import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabaseClient'; // Make sure this path is correct

export const INITIAL_PRODUCTS = [];

// ===== ZUSTAND STORE =====
export const useAppStore = create(
  persist(
    (set, get) => ({
      // ─── Auth ───────────────────────────────────────
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null, cart: [], wishlist: [] }),

      // ─── Global App State ───────────────────────────
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
      recentSearches: [],
      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter(q => q.toLowerCase() !== query.toLowerCase());
        return { recentSearches: [query, ...filtered].slice(0, 10) }; // Keep top 10
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // ─── Products ───────────────────────────────────
      products: INITIAL_PRODUCTS,
      isLoadingProducts: false,

      // Fetch live products from Supabase
      fetchProducts: async () => {
        set({ isLoadingProducts: true });
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles(id, first_name, last_name, avatar_url, is_verified)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Map the Supabase database columns to what the web UI expects
          const formattedData = data.map(item => {
            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            return {
              ...item,
              sellerId: item.seller_id,
              sellerName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
              sellerAvatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=A&background=random&color=fff`,
              isVerified: profile?.is_verified || false,
              type: item.listing_type || 'FOR SALE',
              image: item.image_url || (item.images && item.images[0]) || 'https://via.placeholder.com/300',
              priceDisplay: (item.listing_type === 'FOR TRADE') ? 'Trade' : (String(item.price).includes('GH₵') ? item.price : `GH₵ ${item.price}`)
            };
          });

          set({ products: formattedData, isLoadingProducts: false });
        } else {
          console.error('Error fetching products:', error);
          set({ isLoadingProducts: false });
        }
      },

      // Insert product into Supabase and update local state
      addProduct: async (productData) => {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        // Format the local state addition so the UI doesn't break before a refresh
        const mapToUi = (dbItem) => {
          const profile = get().currentUser || {};
          return {
            ...dbItem,
            sellerId: dbItem.seller_id,
            sellerName: profile.name || 'You',
            sellerAvatar: profile.avatar || `https://ui-avatars.com/api/?name=Y&background=random&color=fff`,
            isVerified: true,
            type: dbItem.listing_type || 'FOR SALE',
            image: dbItem.image_url || (dbItem.images && dbItem.images[0]) || 'https://via.placeholder.com/300',
            priceDisplay: (dbItem.listing_type === 'FOR TRADE') ? 'Trade' : (String(dbItem.price).includes('GH₵') ? dbItem.price : `GH₵ ${dbItem.price}`)
          };
        };

        if (!error && data && data.length > 0) {
          set((state) => ({ products: [mapToUi(data[0]), ...state.products] }));
        } else {
          console.error('Error adding product to Supabase:', error);
          // Fallback to local state so the UI still updates
          set((state) => ({ products: [mapToUi(productData), ...state.products] }));
        }
      },
      getProductById: (id) => get().products.find((p) => p.id === id),

      // ─── Top Sellers ────────────────────────────────
      topSellers: [],
      isLoadingSellers: false,
      fetchTopSellers: async () => {
        set({ isLoadingSellers: true });
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, trust_score, is_verified')
          .order('trust_score', { ascending: false })
          .limit(10);
          
        if (!error && data) {
          const formatted = data.map(profile => ({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=S&background=random&color=fff`,
            rating: Number(profile.trust_score || 5.0).toFixed(1),
            isVerified: profile.is_verified || false
          }));
          set({ topSellers: formatted, isLoadingSellers: false });
        } else {
          console.error('Error fetching top sellers:', error);
          set({ isLoadingSellers: false });
        }
      },

      // ─── Wishlist ───────────────────────────────────
      // Stores product IDs
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),
      isWishlisted: (productId) => get().wishlist.includes(productId),

      // ─── Cart ───────────────────────────────────────
      // Each entry: { product, type }  (type: 'sell' | 'rent' | 'trade')
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const alreadyIn = state.cart.some((entry) => entry.product.id === product.id);
          if (alreadyIn) return state;
          const cartType =
            product.type === 'FOR RENT' ? 'rent' :
              product.type === 'FOR TRADE' ? 'trade' : 'sell';
          return { cart: [...state.cart, { product, type: cartType }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((entry) => entry.product.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      isInCart: (productId) =>
        get().cart.some((entry) => entry.product.id === productId),

      // ─── Orders ───────────────────────────────────────
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      // ─── Messages ─────────────────────────────────────
      conversations: [],
      sendMessage: (conversationId, text) => set((state) => {
        const newConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, { id: Date.now().toString(), senderId: 'me', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
            }
          }
          return c;
        });
        return { conversations: newConversations };
      }),
      createConversation: (participant, productId) => set((state) => {
        const existing = state.conversations.find(c => c.participant.id === participant.id && c.productId === productId);
        if (existing) return { currentConversationId: existing.id };
        const newConv = {
          id: 'c_' + Date.now(),
          participant,
          productId,
          messages: []
        };
        return { conversations: [newConv, ...state.conversations], currentConversationId: newConv.id };
      }),

      // ─── Inventory (Private Stash) ───────────────────
      inventory: [],
      addToInventory: (product) => set((state) => {
        const existing = state.inventory.find(i => i.id === product.id);
        if (existing) {
          return { inventory: state.inventory.map(i => i.id === product.id ? product : i) };
        }
        return { inventory: [product, ...state.inventory] };
      }),
      removeFromInventory: (productId) => set((state) => ({
        inventory: state.inventory.filter(i => i.id !== productId)
      })),
      publishFromInventory: async (productId) => {
        const state = get();
        const item = state.inventory.find(i => i.id === productId);
        if (!item) return;

        // Push to live DB
        const { data, error } = await supabase
          .from('products')
          .insert([item])
          .select();

        // Format for UI
        const mapToUi = (dbItem) => ({
          ...dbItem,
          type: dbItem.listing_type || 'FOR SALE',
          image: dbItem.image_url || (dbItem.images && dbItem.images[0]) || 'https://via.placeholder.com/300',
          priceDisplay: (dbItem.listing_type === 'FOR TRADE') ? 'Trade' : (String(dbItem.price).includes('GH₵') ? dbItem.price : `GH₵ ${dbItem.price}`)
        });

        if (!error && data && data.length > 0) {
          set({
            inventory: state.inventory.filter(i => i.id !== productId),
            products: [mapToUi(data[0]), ...state.products]
          });
        } else {
          console.error("Failed to publish from inventory:", error);
          // Fallback locally
          set({
            inventory: state.inventory.filter(i => i.id !== productId),
            products: [mapToUi(item), ...state.products]
          });
        }
      }
    }),
    {
      name: 'campuhub-storage',
    }
  )
);