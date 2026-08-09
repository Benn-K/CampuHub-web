import React, { useEffect, useState } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';

// Mocking expo-router for Web
const router = {
  back: () => window.history.back(),
};

// Transforming Ionicons to SVG
const Ionicons = ({ name, size, color, style }) => {
  let iconContent = null;
  if (name === 'close') {
    iconContent = <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>;
  } else if (name === 'camera') {
    iconContent = <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></>;
  } else if (name === 'add') {
    iconContent = <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {iconContent}
    </svg>
  );
};

const LISTING_TYPES = ['FOR SALE', 'FOR RENT', 'FOR TRADE'];
const CONDITIONS = ['New', 'Like New', 'Used', 'Refurbished'];

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#F8F9FB', height: '100%' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#F3F4F6' },
  headerIconBtn: { padding: 4, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1F36', margin: 0 },
  headerSaveText: { fontSize: 16, fontWeight: '800', color: '#005DE3', margin: 0 },
  saveBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex' },
  scrollContent: { padding: 20, overflowY: 'auto' },
  
  photoSection: { marginBottom: 25 },
  photoHeader: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 12, margin: '0 0 12px 0' },
  photoCounter: { fontSize: 12, fontWeight: '700', color: '#005DE3', margin: 0 },
  photoSubText: { fontSize: 12, color: '#6B7280', marginBottom: 5, margin: '0 0 5px 0' },
  imagePickerLarge: { width: '100%', height: 140, backgroundColor: '#fff', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D6E4FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 10 },
  imagePickerSmall: { minWidth: 100, height: 100, backgroundColor: '#EAEFFF', borderRadius: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D6E4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15, cursor: 'pointer' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EAEFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  imagePickerTitle: { fontSize: 15, fontWeight: '800', color: '#1A1F36', margin: 0 },
  
  imageScroll: { display: 'flex', flexDirection: 'row', overflowX: 'auto', marginTop: 10, paddingBottom: 5 },
  imagePreviewContainer: { minWidth: 100, height: 100, borderRadius: 16, marginRight: 15, position: 'relative' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: '#FF4757', width: 24, height: 24, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'solid', borderColor: '#fff', zIndex: 10, cursor: 'pointer', padding: 0 },

  pillRow: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 20, borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', cursor: 'pointer' },
  pillActive: { backgroundColor: '#1A1F36', borderColor: '#1A1F36' },
  pillText: { fontSize: 13, fontWeight: '700', color: '#6B7280', margin: 0 },
  pillTextActive: { color: '#fff' },

  section: { marginBottom: 25 },
  inputGroup: { marginBottom: 25 },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#1A1F36', marginBottom: 8, margin: '0 0 8px 0' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', borderRadius: 16, height: 54, paddingLeft: 16, paddingRight: 16, fontSize: 15, color: '#1A1F36', width: '100%', boxSizing: 'border-box' },
  
  priceInputWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', borderRadius: 16, height: 54, paddingLeft: 16, paddingRight: 16 },
  currencySymbol: { fontSize: 16, fontWeight: '800', color: '#6B7280', marginRight: 8, margin: '0 8px 0 0' },
  priceInput: { flex: 1, fontSize: 16, color: '#1A1F36', fontWeight: '700', border: 'none', outline: 'none', width: '100%' },
  
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#E5E7EB', borderRadius: 16, minHeight: 120, paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16, fontSize: 15, color: '#1A1F36', resize: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  
  hiddenFileInput: { display: 'none' }
};

export default function EditListingSubPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  
  // Parse ID from URL
  const hashParts = window.location.hash.split('?id=');
  const id = hashParts.length > 1 ? hashParts[1] : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState('FOR SALE');
  const [condition, setCondition] = useState('Used');
  
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Mocking fetch logic
    const fetchProductDetails = async () => {
      if (!id) {
        window.alert("Error\nMissing information.");
        router.back();
        return;
      }

      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        setTitle("Mock Item " + id);
        setPrice("150");
        setDescription("This is a mock description for item " + id);
        setListingType('FOR SALE');
        setCondition('Used');
        setImages(['https://picsum.photos/seed/' + id + '/300/300']);

      } catch (error) {
        window.alert("Error\nCould not load listing details.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      
      if (images.length + newImages.length > 5) {
        window.alert("Limit Reached\nYou can only upload up to 5 images.");
        return;
      }
      
      setImages(prev => [...prev, ...newImages]);
    }
  };
  
  const triggerFileInput = () => {
    document.getElementById('edit-file-input').click();
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    if (images.length === 0) {
      window.alert("Missing Image\nPlease upload at least one image for your listing.");
      return;
    }

    if (!title.trim()) {
      window.alert("Missing Title\nPlease enter a title for your item.");
      return;
    }

    if (listingType !== 'FOR TRADE' && !price.trim()) {
      window.alert("Missing Price\nPlease enter a price, or change the type to 'Trade'.");
      return;
    }

    setIsSaving(true);

    try {
      // Mock saving
      await new Promise(resolve => setTimeout(resolve, 1000));

      window.alert("Success\nYour listing has been updated!");
      router.back();

    } catch (error) {
      window.alert("Update Failed\nCould not save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#005DE3', fontWeight: 'bold' }}>Loading listing details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <button style={styles.headerIconBtn} onClick={() => router.back()} disabled={isSaving}>
          <Ionicons name="close" size={24} color="#1A1F36" />
        </button>
        
        <p style={styles.headerTitle}>Edit Listing</p>
        
        <button style={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <span style={{ color: '#005DE3', fontSize: 16, fontWeight: '800' }}>Saving...</span>
          ) : (
            <p style={styles.headerSaveText}>Save</p>
          )}
        </button>
      </div>

      <div style={styles.scrollContent}>
        
        {/* PHOTO SECTION */}
        <div style={styles.photoSection}>
          <div style={styles.photoHeader}>
            <p style={styles.sectionLabel}>Photos</p>
            <p style={styles.photoCounter}>{images.length}/5</p>
          </div>
          <p style={styles.photoSubText}>Please upload between 1 to 5 images. Maximum 5MB per image.</p>
          
          <input 
            id="edit-file-input" 
            type="file" 
            accept="image/*" 
            multiple 
            style={styles.hiddenFileInput} 
            onChange={handleImageChange} 
          />

          {images.length === 0 ? (
             <div style={styles.imagePickerLarge} onClick={triggerFileInput}>
               <div style={styles.iconCircle}>
                 <Ionicons name="camera" size={32} color="#005DE3" />
               </div>
               <p style={styles.imagePickerTitle}>Tap to Upload Photos</p>
             </div>
          ) : (
            <div style={styles.imageScroll}>
              {images.map((uri, index) => (
                <div key={index} style={styles.imagePreviewContainer}>
                  <img src={uri} style={styles.imagePreview} alt="upload preview" />
                  <button style={styles.removeImageBtn} onClick={() => removeImage(index)}>
                    <Ionicons name="close" size={14} color="#fff" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <div style={styles.imagePickerSmall} onClick={triggerFileInput}>
                  <Ionicons name="add" size={32} color="#005DE3" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* LISTING TYPE */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>I want to...</p>
          <div style={styles.pillRow}>
            {LISTING_TYPES.map((type) => (
              <button 
                key={type} 
                style={{ ...styles.pill, ...(listingType === type ? styles.pillActive : {}) }}
                onClick={() => setListingType(type)}
              >
                <p style={{ ...styles.pillText, ...(listingType === type ? styles.pillTextActive : {}) }}>
                  {type.replace('FOR ', '')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div style={styles.inputGroup}>
          <p style={styles.inputLabel}>Item Title</p>
          <input
            style={styles.input}
            placeholder="e.g. Calculus Textbook 9th Ed."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
        </div>

        {/* PRICE */}
        {listingType !== 'FOR TRADE' && (
          <div style={styles.inputGroup}>
            <p style={styles.inputLabel}>
              {listingType === 'FOR RENT' ? 'Rental Price (Total)' : 'Selling Price'}
            </p>
            <div style={styles.priceInputWrapper}>
              <p style={styles.currencySymbol}>GH₵</p>
              <input
                style={styles.priceInput}
                placeholder="0.00"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* CONDITION */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Condition</p>
          <div style={styles.pillRow}>
            {CONDITIONS.map((cond) => (
              <button 
                key={cond} 
                style={{ ...styles.pill, ...(condition === cond ? styles.pillActive : {}) }}
                onClick={() => setCondition(cond)}
              >
                <p style={{ ...styles.pillText, ...(condition === cond ? styles.pillTextActive : {}) }}>
                  {cond}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={{ ...styles.inputGroup, marginBottom: 40 }}>
          <p style={styles.inputLabel}>Description</p>
          <textarea
            style={styles.textArea}
            placeholder="Describe any flaws, specific models, or pickup preferences..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}
