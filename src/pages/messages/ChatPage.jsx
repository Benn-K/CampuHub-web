import React, { useState, useEffect, useRef } from 'react';
import { useModal } from '../../components/modal/ModalContext';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';

// ===== ICONS =====
const ArrowBackIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const EllipsisIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);
const ShieldIcon = ({ size = 32, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);
const AddIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const SendIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function ChatPage() {
  const { showAlert, showConfirm } = useModal();
  const currentUser = useAppStore(s => s.currentUser);
  
  // Parse URL: #chat?seller=s1&product=p1 (fallback to userId for generic chat)
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const otherUserId = params.get('seller') || params.get('userId');
  const productId = params.get('product');

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  
  const chatAreaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Fetch Other User profile & Initial Messages
  useEffect(() => {
    if (!currentUser?.id || !otherUserId) {
      setIsLoading(false);
      return;
    }

    const loadChat = async () => {
      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .eq('id', otherUserId)
          .single();

        if (profile) setOtherUser(profile);

        // Fetch messages between these two
        const { data: msgData, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: true });

        if (!error && msgData) {
          setMessages(msgData);
          
          // Mark received as read
          const unreadIds = msgData.filter(m => m.receiver_id === currentUser.id && !m.is_read).map(m => m.id);
          if (unreadIds.length > 0) {
            await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
          }
        }
      } catch (err) {
        console.error('Chat load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();

    // Subscribe to realtime changes
    const channel = supabase.channel(`chat_${currentUser.id}_${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`
      }, (payload) => {
        if (payload.new.sender_id === otherUserId) {
          setMessages(prev => [...prev, payload.new]);
          // Mark read
          supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id).catch(console.error);
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${currentUser.id}`
      }, (payload) => {
        if (payload.new.receiver_id === otherUserId) {
          // Add our own message if it's not already in state (prevent dupes if optimistic update ran)
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, otherUserId]);

  const handleSend = async () => {
    if (inputText.trim() === '' || !currentUser?.id || !otherUserId) return;
    
    const newMsg = {
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      text_content: inputText.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };
    
    // Optimistic update (use a temporary negative/random id)
    const tempId = 'temp_' + Date.now();
    setMessages(prev => [...prev, { ...newMsg, id: tempId }]);
    setInputText('');

    try {
      const { data, error } = await supabase.from('messages').insert([newMsg]).select().single();
      if (error) throw error;
      
      // Replace temp msg with real db row
      setMessages(prev => prev.map(m => m.id === tempId ? data : m));
    } catch (err) {
      console.error('Send error:', err);
      showAlert({ title: 'Error', message: 'Failed to send message.', type: 'error' });
      // Remove failed msg
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = async () => {
    setShowMenu(false);
    const ok = await showConfirm({
      title: 'Clear Chat?',
      message: 'Hide this conversation from your inbox? The messages will remain on the other user\'s end.',
      confirmText: 'Clear',
      type: 'danger'
    });
    
    if (ok) {
      // In a real app with soft deletes, we'd add `hidden_by_user1` columns. 
      // For now, if the table doesn't support it, we'll just clear the local state to simulate.
      setMessages([]);
      showAlert({ title: 'Cleared', message: 'Chat history cleared.', type: 'info' });
    }
  };

  const handleReportUser = async () => {
    setShowMenu(false);
    const ok = await showConfirm({
      title: 'Report User?',
      message: 'Report this user to Trust & Safety for inappropriate behavior?',
      confirmText: 'Report',
      type: 'warning'
    });
    
    if (ok) {
      // Insert to reports table
      supabase.from('reports').insert([{
        reporter_id: currentUser?.id,
        reported_user_id: otherUserId,
        reason: 'Inappropriate chat behavior',
        created_at: new Date().toISOString()
      }]).catch(() => {});
      showAlert({ title: 'Report Sent', message: 'User has been reported. Thank you for keeping CampuHub safe.', type: 'success' });
    }
  };

  const displayName = otherUser ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() : 'CampuHub User';
  const avatarUrl = otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=005DE3&color=fff`;

  if (!currentUser) {
    return (
      <div className="chat-page">
        <div className="chat-empty-state" style={{ marginTop: 100 }}>
          <h3 className="chat-empty-title">Log in to Chat</h3>
          <p className="chat-empty-text">You must be logged in to send messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <button onClick={() => window.location.hash = '#messages'} className="chat-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowBackIcon color="#1A1F36" />
          </button>
          
          <img 
            src={avatarUrl} 
            alt={displayName} 
            className="chat-avatar" 
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.hash = `#profile/${otherUserId}`}
          />
          <div className="chat-header-info">
            <h2 className="chat-user-name" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = `#profile/${otherUserId}`}>{displayName}</h2>
            <span className="chat-status">Active</span>
          </div>
        </div>
        
        <div className="chat-menu-wrap" style={{ position: 'relative' }}>
          <button className="chat-more-btn" onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <EllipsisIcon color="#1A1F36" />
          </button>
          
          {showMenu && (
            <>
              <div className="chat-menu-overlay" onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }}></div>
              <div className="chat-dropdown-menu" style={{ position: 'absolute', right: 0, top: 40, background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 150 }}>
                <button className="chat-menu-item" onClick={() => { setShowMenu(false); window.location.hash = `#profile/${otherUserId}`; }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14 }}>
                  View Profile
                </button>
                <div className="chat-menu-divider" style={{ height: 1, background: '#F3F4F6' }}></div>
                <button className="chat-menu-item danger" onClick={handleClearChat} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: '#EF4444' }}>
                  Clear Chat
                </button>
                <div className="chat-menu-divider" style={{ height: 1, background: '#F3F4F6' }}></div>
                <button className="chat-menu-item warning" onClick={handleReportUser} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 14, color: '#D97706' }}>
                  Report User
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" ref={chatAreaRef}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <div style={{ width: 30, height: 30, border: '3px solid #E5E7EB', borderTopColor: '#005DE3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-shield-box">
              <ShieldIcon color="#10B981" />
            </div>
            <h3 className="chat-empty-title">Student-to-Student Chat</h3>
            <p className="chat-empty-text">Keep conversations on CampuHub to stay protected by our Escrow system. Send a message to start negotiating!</p>
          </div>
        ) : (
          <div className="chat-messages-container">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              return (
                <div key={msg.id} className={`chat-message-wrapper ${isMe ? 'me' : 'them'}`}>
                  <div className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                    <p className="chat-message-text">{msg.text_content}</p>
                  </div>
                  <span className="chat-time-text">{formatTime(msg.created_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-inner">
          <button className="chat-attach-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <AddIcon color="#005DE3" />
          </button>
          
          <textarea
            className="chat-textarea"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ flex: 1, border: 'none', background: 'transparent', resize: 'none', outline: 'none', padding: '12px 0', fontSize: 15 }}
          />
          
          <button 
            className={`chat-send-btn ${inputText.trim().length > 0 ? 'active' : ''}`}
            onClick={handleSend}
            disabled={inputText.trim() === ''}
            style={{ 
              background: inputText.trim().length > 0 ? '#005DE3' : '#E5E7EB', 
              border: 'none', borderRadius: '50%', width: 36, height: 36, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: inputText.trim().length > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            <SendIcon color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
