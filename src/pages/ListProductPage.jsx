import React, { useState, useEffect } from 'react';
import { useModal } from '../components/modal/ModalContext';
import './list.css';
import { useAppStore } from '../store';
import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';


// ===== ICONS =====
const CameraIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>
  </svg>
);
const LocationIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const CloseIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const PlusIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const ChevronDownIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const CubeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const EditIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);
const TrashIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const ArchiveIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>
  </svg>
);
const ArrowRightIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
const CheckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TYPES = ['FOR SALE', 'FOR RENT', 'FOR TRADE'];
const CONDITIONS = ['New', 'Like New', 'Used', 'Refurbished'];
const CATEGORIES = [
  { id: 'Academics', label: 'Academics' },
  { id: 'Computing', label: 'Computing & Tech' },
  { id: 'Phones', label: 'Phones & Tablets' },
  { id: 'Audio', label: 'Audio Devices' },
  { id: 'Gaming', label: 'Gaming' },
  { id: 'Fashion', label: 'Fashion' },
  { id: 'Hostel', label: 'Hostel Essentials' },
  { id: 'Sports', label: 'Sports & Fitness' },
  { id: 'Music', label: 'Instruments' },
];

export default function ListProductPage() {
  const { showAlert, showConfirm } = useModal();
  const addProduct = useAppStore((s) => s.addProduct);
  const currentUser = useAppStore((s) => s.currentUser);

  const [activeTab, setActiveTab] = useState('create');
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [activeType, setActiveType] = useState('');
  const [activeCondition, setActiveCondition] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const [openDropdown, setOpenDropdown] = useState('none');
  const [images, setImages] = useState([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared state
  const userLocation = useAppStore(s => s.userLocation);
  const setUserLocation = useAppStore(s => s.setUserLocation);
  
  // Local location state to show to the user
  const [locationStatus, setLocationStatus] = useState('Fetching location...');

  useEffect(() => {
    if (userLocation) {
      setLocationStatus(userLocation);
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('Offline Mode — GPS Failed');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode via Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`);
          if (!res.ok) throw new Error('Geocoding failed');
          const data = await res.json();
          
          const area = data.address.city || data.address.town || data.address.suburb || data.address.neighbourhood || data.address.village || 'Unknown Area';
          const landmark = data.address.road || data.address.amenity || data.address.building || '';
          
          let resolvedLocation = area;
          if (landmark && landmark !== area) {
            resolvedLocation = `${area} • NEAR ${landmark.toUpperCase()}`;
          }
          
          setLocationStatus(resolvedLocation);
          setUserLocation(resolvedLocation);
        } catch (err) {
          setLocationStatus('Offline Mode — GPS Failed');
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Location Access Denied — enable in browser settings');
        } else {
          setLocationStatus('Offline Mode — GPS Failed');
        }
      },
      { timeout: 10000 }
    );
  }, [userLocation, setUserLocation]);

  const [liveInventory, setLiveInventory] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('None');

  const fetchDrafts = async () => {
    if (!currentUser?.id) return;
    setIsLoadingInventory(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'draft')
        .eq('seller_id', currentUser.id);

      if (error) throw error;
      setLiveInventory(data || []);
    } catch (err) {
      console.error('Fetch drafts error:', err);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchDrafts();
    }
  }, [activeTab]);

  // Upload file directly to Supabase Storage
  const uploadImageToSupabase = async (file) => {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    // Assuming you have a storage bucket named 'product-images'
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      showAlert({ title: 'Too Many Photos', message: 'You can only upload up to 5 images.', type: 'warning' });
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    for (const file of files) {
      try {
        const compressedFile = await imageCompression(file, options);
        if (compressedFile.size > 2 * 1024 * 1024) {
          showAlert({ title: 'File Too Large', message: `"${file.name}" is still too large after compression. Please use a smaller image.`, type: 'error' });
          continue;
        }
        const url = await uploadImageToSupabase(compressedFile);
        if (url) uploadedUrls.push(url);
      } catch (error) {
        console.error('Compression or upload error:', error);
        showAlert({ title: 'Upload Failed', message: `Could not upload "${file.name}". Please try again.`, type: 'error' });
      }
    }

    setImages(prev => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setActiveType('');
    setActiveCondition('');
    setActiveCategory('');
    setOpenDropdown('none');
    setImages([]);
  };

  const validateForm = () => {
    if (images.length === 0) { showAlert({ title: 'Photo Required', message: 'Please upload at least 1 photo of your item.', type: 'warning' }); return false; }
    if (!activeType) { showAlert({ title: 'Listing Type Required', message: 'Please select a listing type (For Sale, Rent, or Trade).', type: 'warning' }); return false; }
    if (!title.trim()) { showAlert({ title: 'Title Required', message: 'Please provide a title for your listing.', type: 'warning' }); return false; }
    if (!price && activeType !== 'FOR TRADE') { showAlert({ title: 'Price Required', message: 'Please enter a price for your item.', type: 'warning' }); return false; }
    if (!activeCategory) { showAlert({ title: 'Category Required', message: 'Please select a category for your item.', type: 'warning' }); return false; }
    if (!activeCondition) { showAlert({ title: 'Condition Required', message: 'Please select the condition of your item.', type: 'warning' }); return false; }
    if (!description.trim()) { showAlert({ title: 'Description Required', message: 'Please write a description for your listing.', type: 'warning' }); return false; }
    return true;
  };

  const buildProductData = (status) => {
    return {
      title: title.trim(),
      price: activeType === 'FOR TRADE' ? 0 : parseFloat(price) || 0,
      listing_type: activeType,
      condition: activeCondition,
      category: activeCategory,
      description: description.trim(),
      image_url: images[0] || null,
      images: images,
      status: status,
      seller_id: currentUser?.id || null,
      location: userLocation || 'Offline'
    };
  };

  const handlePostItem = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const productData = buildProductData('live');
    const { error } = await supabase.from('products').insert([productData]);

    setIsSubmitting(false);
    
    if (error) {
      console.error('Insert error:', error);
      showAlert({ title: 'Publish Failed', message: `Could not publish your item. ${error.message}`, type: 'error' });
      return;
    }

    await showAlert({ title: '🎉 Item Published!', message: 'Your item is now live on the campus marketplace!', type: 'success', confirmText: 'View Feed' });
    resetForm();
    window.location.hash = '#home';
  };

  const handleSaveToInventory = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    const productData = buildProductData('draft');
    
    let error = null;
    if (editingId) {
       const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingId);
       error = updateError;
    } else {
       const { error: insertError } = await supabase.from('products').insert([productData]);
       error = insertError;
    }

    setIsSubmitting(false);

    if (error) {
      console.error('Draft error:', error);
      showAlert({ title: 'Save Failed', message: `Could not save draft. ${error.message}`, type: 'error' });
      return;
    }

    await showAlert({ title: '📦 Saved to Stash!', message: 'Item saved to your private inventory. Publish it whenever you\'re ready.', type: 'success', confirmText: 'View Stash' });
    resetForm();
    setActiveTab('inventory');
  };

  const handleEditTap = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setPrice(item.price ? item.price.toString() : '');
    setDescription(item.description);
    setActiveType(item.type);
    setActiveCondition(item.condition);
    setActiveCategory(item.category);
    setImages(item.images || []);
    setActiveTab('create');
  };

  const handlePublishFromInventory = async (id) => {
    const confirmed = await showConfirm({
      title: 'Publish Listing?',
      message: 'This will move the item from your private stash and make it live on the marketplace.',
      confirmText: 'Publish',
      type: 'confirm'
    });
    if (!confirmed) return;
    try {
      const { error } = await supabase.from('products').update({ status: 'live' }).eq('id', id);
      if (error) throw error;
      showAlert({ title: '🎉 Item is Live!', message: 'Your item has been published to the campus marketplace.', type: 'success' });
      setLiveInventory(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Publish Failed', message: 'Could not publish item. Please try again.', type: 'error' });
    }
  };

  const handleDeleteInventory = async (id) => {
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
      setLiveInventory(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Delete Failed', message: 'Could not remove the item. Please try again.', type: 'error' });
    }
  };

  const filteredInventory = liveInventory
    .filter(item => filterType === 'All' ? true : item.type === filterType.toUpperCase())
    .sort((a, b) => {
      if (sortOrder === 'LowToHigh') return (a.price || 0) - (b.price || 0);
      if (sortOrder === 'HighToLow') return (b.price || 0) - (a.price || 0);
      return 0; // None
    });

  const renderDropdown = (label, activeValue, options, dropdownKey) => {
    const isOpen = openDropdown === dropdownKey;
    const isPlaceholder = !activeValue;

    let displayValue = label;
    if (activeValue) {
      if (dropdownKey === 'type' || dropdownKey === 'condition') {
        displayValue = activeValue.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      } else if (dropdownKey === 'category') {
        const cat = CATEGORIES.find(c => c.id === activeValue);
        displayValue = cat ? cat.label : activeValue;
      } else {
        displayValue = activeValue;
      }
    }

    return (
      <div className="list-form-group-prof">
        <label className="list-label-prof">{label}</label>
        <div className="list-dropdown-wrap-prof">
          <button
            className={`list-dropdown-btn-prof ${isOpen ? 'active' : ''} ${isPlaceholder ? 'placeholder' : ''}`}
            onClick={(e) => { e.preventDefault(); setOpenDropdown(isOpen ? 'none' : dropdownKey); }}
          >
            {displayValue}
            <ChevronDownIcon color={isOpen ? "#005DE3" : "#9CA3AF"} />
          </button>

          {isOpen && (
            <div className="list-dropdown-menu-prof">
              {options.map((option) => {
                const id = typeof option === 'string' ? option : option.id;
                let val = typeof option === 'string' ? option : option.label;
                if (dropdownKey === 'type') {
                  val = val.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
                }
                const isActive = activeValue === id;
                return (
                  <button
                    key={id}
                    className={`list-dropdown-item-prof ${isActive ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (dropdownKey === 'type') setActiveType(id);
                      if (dropdownKey === 'category') setActiveCategory(id);
                      if (dropdownKey === 'condition') setActiveCondition(id);
                      setOpenDropdown('none');
                    }}
                  >
                    <span>{val}</span>
                    {isActive && <CheckIcon color="#005DE3" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="list-page-prof">
      <div className="list-inner-prof">

        {/* Header */}
        <div className="list-page-header-prof">
          <h1 className="list-page-title-prof">Listings</h1>
        </div>

        {/* Tabs */}
        <div className="list-tabs-prof">
          <button
            className={`list-tab-btn-prof ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            {editingId ? 'Edit Item' : 'Create Listing'}
          </button>
          <button
            className={`list-tab-btn-prof ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { resetForm(); setActiveTab('inventory'); }}
          >
            My Inventory
          </button>
        </div>

        {/* Content Area */}
        <div onClick={(e) => { if (openDropdown !== 'none' && !e.target.closest('.list-dropdown-wrap-prof')) setOpenDropdown('none'); }}>

          {activeTab === 'create' && (
            <div className="list-layout-prof">
              {/* Left Column: Photos */}
              <div className="list-left-prof">
                <div className="list-section-header-prof">
                  <h3>Photos</h3>
                  <span className="list-counter-prof">{images.length}/5</span>
                </div>
                <p className="list-help-text-prof">Please upload between 1 to 5 images. Maximum 5MB per image.</p>

                <div className="list-image-grid-prof">
                  {images.map((src, idx) => (
                    <div key={idx} className="list-image-preview-prof">
                      <img src={src} alt={`Upload ${idx + 1}`} />
                      <button className="list-image-remove-prof" onClick={() => removeImage(idx)}>
                        <CloseIcon color="#fff" size={14} />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <div
                      className={`list-image-add-prof ${images.length === 0 ? 'large' : ''}`}
                      onClick={() => document.getElementById('photo-upload').click()}
                      style={{ opacity: isUploading ? 0.5 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}
                    >
                      <input id="photo-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      <div className="list-image-add-icon-prof">
                        {isUploading ? <div className="list-spinner-small" /> : (images.length === 0 ? <CameraIcon size={28} /> : <PlusIcon size={24} />)}
                      </div>
                      {images.length === 0 && <span>{isUploading ? 'Uploading...' : 'Tap or click to Upload Photos'}</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="list-right-prof">
                {renderDropdown('Listing Type', activeType, TYPES, 'type')}

                <div className="list-form-group-prof">
                  <label className="list-label-prof">Title</label>
                  <input
                    type="text"
                    className="list-input-prof"
                    placeholder="Enter name of your product"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {activeType !== 'FOR TRADE' && (
                  <div className="list-form-group-prof">
                    <label className="list-label-prof">{activeType === 'FOR RENT' ? 'Rental Price (per wk/day)' : 'Price (GH₵)'}</label>
                    <input
                      type="text"
                      className="list-input-prof"
                      placeholder="Enter the price you want (numbers only)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                    />
                  </div>
                )}

                <div className="list-form-row-prof">
                  {renderDropdown('Category', activeCategory, CATEGORIES, 'category')}
                  {renderDropdown('Condition', activeCondition, CONDITIONS, 'condition')}
                </div>

                <div className="list-form-group-prof">
                  <label className="list-label-prof">Description</label>
                  <textarea
                    className="list-textarea-prof"
                    placeholder="Describe your item in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="list-form-group-prof">
                  <label className="list-label-prof">Campus Location</label>
                  <div style={{ backgroundColor: '#F8F9FB', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LocationIcon size={18} color="#9CA3AF" />
                    <span style={{ fontSize: '15px', color: '#4B5563', fontWeight: '500' }}>{locationStatus}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '8px 0 0 4px' }}>This tag is automatically applied to your listings based on your GPS.</p>
                </div>

                {/* Form Actions */}
                <div className="list-actions-prof">
                  {editingId ? (
                    <>
                      <button className="list-btn-prof list-btn-stash-prof" onClick={resetForm} disabled={isSubmitting || isUploading}>Cancel</button>
                      <button className="list-btn-prof list-btn-publish-prof" onClick={handleSaveToInventory} disabled={isSubmitting || isUploading}>
                        {isSubmitting ? 'Updating...' : 'Update Item'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="list-btn-prof list-btn-stash-prof" onClick={handleSaveToInventory} disabled={isSubmitting || isUploading}>
                        <ArchiveIcon size={18} /> Save to Stash
                      </button>
                      <button className="list-btn-prof list-btn-publish-prof" onClick={handlePostItem} disabled={isSubmitting || isUploading}>
                        {isSubmitting ? 'Publishing...' : 'Publish'} <ArrowRightIcon size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="list-inventory-prof">
              <div className="list-inv-header-prof">
                <div className="list-inv-icon-wrap-prof">
                  <CubeIcon size={28} />
                </div>
                <div className="list-inv-header-info-prof">
                  <h3>Your Private Stash</h3>
                  <p>These items are hidden from the feed. Use them to make trade offers or publish them later.</p>
                </div>
              </div>
              {isLoadingInventory ? (
                <div className="list-loading-spinner"></div>
              ) : liveInventory.length === 0 ? (
                <div className="list-empty-prof">
                  <CubeIcon size={48} color="#D1D5DB" />
                  <p>Your stash is empty.</p>
                  <button className="list-submit-btn-prof" onClick={() => setActiveTab('create')} style={{ width: 'auto', padding: '12px 24px', marginTop: 16 }}>
                    Create a Draft
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <select 
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="FOR SALE">For Sale</option>
                      <option value="FOR RENT">For Rent</option>
                      <option value="FOR TRADE">For Trade</option>
                    </select>
                    <select 
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}
                      value={sortOrder} 
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="None">Sort: None</option>
                      <option value="LowToHigh">Price: Low to High</option>
                      <option value="HighToLow">Price: High to Low</option>
                    </select>
                  </div>
                  <div className="list-inv-grid-prof">
                    {filteredInventory.map(item => (
                      <div key={item.id} className="list-inv-card-prof">
                        <div className="list-inv-card-top-prof">
                          <img src={(item.images && item.images[0]) || item.image || 'https://picsum.photos/seed/fallback/150/150'} alt={item.title} className="list-inv-img-prof" />
                          <div className="list-inv-details-prof">
                            <h4 className="list-inv-title-prof" title={item.title}>{item.title}</h4>
                            <span className="list-inv-meta-prof">{item.type} • {item.condition}</span>
                            {item.price !== null && <p className="list-inv-price-prof">GH₵ {item.price}</p>}
                            {item.price === null && <p className="list-inv-price-prof">TRADE</p>}
                          </div>
                        </div>
                        <div className="list-inv-actions-prof">
                          <button className="list-inv-action-btn-prof" onClick={() => handleEditTap(item)} title="Edit">
                            <EditIcon /> Edit
                          </button>
                          <button className="list-inv-action-btn-prof list-inv-action-publish-prof" onClick={() => handlePublishFromInventory(item.id)} title="Publish to Feed">
                            <ArrowRightIcon size={16} /> Publish
                          </button>
                          <button className="list-inv-action-btn-prof list-inv-action-delete-prof" onClick={() => handleDeleteInventory(item.id)} title="Delete">
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}