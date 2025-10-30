import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI, commentsAPI } from '../api/tickets';
import { ticketStyles } from '../shared/componentStyles';
import EditTicket from '../components/EditTicket';
import Chat from '../components/Chat';

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const data = await ticketsAPI.getOne(id);
      setTicket(data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      if (error.response?.status === 403) {
        navigate('/tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await commentsAPI.create({
        ticket_id: id,
        comment: commentText
      });
      setCommentText('');
      fetchTicket();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await ticketsAPI.update(id, { status: newStatus });
      fetchTicket();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketsAPI.delete(id);
        navigate('/tickets');
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Failed to delete ticket');
      }
    }
  };

  const getBadgeStyle = (type, value) => {
    if (type === 'priority') {
      return ticketStyles.priority[value] || ticketStyles.priority.medium;
    }
    if (type === 'status') {
      return ticketStyles.status[value] || ticketStyles.status.open;
    }
    return {};
  };

  if (loading) {
    return (
      <div style={ticketStyles.container}>
        <div style={ticketStyles.emptyState}>Loading...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={ticketStyles.container}>
        <div style={ticketStyles.emptyState}>Ticket not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={styles.nav}>
        <h1 style={{...styles.navTitle, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>Support Ticketing System</h1>
        <div style={styles.navRight}>
          <span style={styles.userInfo}>Welcome, {user?.name} ({user?.role})</span>
        </div>
      </nav>
    <div style={ticketStyles.container}>
      <button
        onClick={() => navigate('/tickets')}
        style={{ marginBottom: '1.5rem', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}
      >
        ← Back to Tickets
      </button>

      <div style={ticketStyles.form}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>{ticket.subject}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{...ticketStyles.badge, ...getBadgeStyle('priority', ticket.priority)}}>
                {ticket.priority}
              </span>
              <span style={{...ticketStyles.badge, ...getBadgeStyle('status', ticket.status)}}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span style={{...ticketStyles.badge, background: '#e5e7eb', color: '#374151'}}>
                {ticket.category}
              </span>
            </div>
          </div>
          {user.role === 'admin' && (
            <select
              value={ticket.status}
              onChange={handleStatusChange}
              style={ticketStyles.select}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>Description</h3>
          <p style={{ color: '#6b7280', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
        </div>

        {(user.id === ticket.user_id || user.role === 'admin') && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setShowEditModal(true)}
              style={ticketStyles.buttonSecondary}
            >
              Edit Ticket
            </button>
            <button
              onClick={handleDeleteTicket}
              style={ticketStyles.buttonDanger}
            >
              Delete Ticket
            </button>
          </div>
        )}

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Comments</h3>
          
          {ticket.comments && ticket.comments.length > 0 ? (
            <div style={{ marginBottom: '2rem' }}>
              {ticket.comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#1f2937' }}>{comment.user?.name || 'Unknown'}</strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', margin: 0 }}>{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>No comments yet</p>
          )}

          <form onSubmit={handleCommentSubmit}>
            <div style={ticketStyles.formGroup}>
              <label style={ticketStyles.label}>Add Comment</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                style={ticketStyles.textarea}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              style={submitting || !commentText.trim() ? {...ticketStyles.button, opacity: 0.6} : ticketStyles.button}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Chat ticketId={id} />
        </div>
      </div>

      {showEditModal && (
        <EditTicket
          ticketId={id}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchTicket();
          }}
        />
      )}
    </div>
    </div>
  );
};

const styles = {
  nav: {
    background: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb'
  },
  navTitle: {
    margin: 0,
    color: '#667eea',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  userInfo: {
    color: '#6b7280',
    fontWeight: '500'
  }
};

export default TicketDetail;
