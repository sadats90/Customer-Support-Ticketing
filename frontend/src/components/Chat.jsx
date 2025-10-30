import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../api/tickets';

const Chat = ({ ticketId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const data = await messagesAPI.getAll(ticketId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const newMessage = await messagesAPI.create(ticketId, messageText);
      setMessages([...messages, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const styles = {
    container: {
      marginTop: '2rem',
      borderTop: '2px solid #667eea',
      paddingTop: '1.5rem'
    },
    title: {
      marginBottom: '1rem',
      color: '#374151',
      fontSize: '1.25rem',
      fontWeight: '600'
    },
    loading: {
      textAlign: 'center',
      color: '#9ca3af',
      padding: '2rem'
    },
    messagesContainer: {
      maxHeight: '400px',
      overflowY: 'auto',
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    emptyState: {
      textAlign: 'center',
      color: '#9ca3af',
      padding: '2rem'
    },
    message: {
      marginBottom: '1rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      background: 'white',
      border: '1px solid #e5e7eb'
    },
    ownMessage: {
      background: '#eff6ff',
      borderColor: '#bfdbfe',
      marginLeft: 'auto',
      maxWidth: '80%'
    },
    otherMessage: {
      background: 'white',
      maxWidth: '80%'
    },
    messageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      alignItems: 'center'
    },
    messageAuthor: {
      color: '#1f2937',
      fontSize: '0.875rem'
    },
    messageTime: {
      color: '#9ca3af',
      fontSize: '0.75rem'
    },
    messageText: {
      color: '#4b5563',
      fontSize: '0.9375rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word'
    },
    form: {
      width: '100%'
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem'
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    sendButton: {
      padding: '0.75rem 1.5rem',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.9375rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Chat Messages</h3>
      
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user_id === user.id;
            return (
              <div
                key={message.id}
                style={{...styles.message, ...(isOwnMessage ? styles.ownMessage : styles.otherMessage)}}
              >
                <div style={styles.messageHeader}>
                  <strong style={styles.messageAuthor}>
                    {message.user?.name || 'Unknown'}
                    {isOwnMessage && ' (You)'}
                  </strong>
                  <span style={styles.messageTime}>
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={styles.messageText}>{message.message}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim()}
            style={{...styles.sendButton, ...((sending || !messageText.trim()) && styles.sendButtonDisabled)}}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;





