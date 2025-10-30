import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI } from '../api/tickets';
import { ticketStyles } from '../shared/componentStyles';
import CreateTicket from '../components/CreateTicket';
import EditTicket from '../components/EditTicket';

const Tickets = () => {
  const { user, logout } = useAuth();
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    if (id) {
      setEditingTicketId(id);
      setShowEditModal(true);
    }
  }, [id]);

  const fetchTickets = async () => {
    try {
      const data = await ticketsAPI.getAll();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  const handleTicketCreated = () => {
    setShowCreateModal(false);
    fetchTickets();
  };

  const handleDeleteTicket = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketsAPI.delete(id);
        fetchTickets();
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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={styles.nav}>
        <h1 style={{...styles.navTitle, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>Support Ticketing System</h1>
        <div style={styles.navRight}>
          <span style={styles.userInfo}>Welcome, {user?.name} ({user?.role})</span>
          <button onClick={async () => { await logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
    <div style={ticketStyles.container}>
      <div style={ticketStyles.header}>
        <h1 style={ticketStyles.title}>Tickets</h1>
        <button onClick={() => setShowCreateModal(true)} style={ticketStyles.button}>
          + Create Ticket
        </button>
      </div>

      {loading ? (
        <div style={ticketStyles.emptyState}>Loading...</div>
      ) : tickets.length === 0 ? (
        <div style={ticketStyles.emptyState}>
          <h3>No tickets found</h3>
          <p>Create your first ticket to get started</p>
        </div>
      ) : (
        <div style={ticketStyles.grid}>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={ticketStyles.card}
            >
              <div onClick={() => handleTicketClick(ticket.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={ticketStyles.cardTitle}>{ticket.subject}</h3>
                  {ticket.user && (
                    <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                      {ticket.user.name}
                    </span>
                  )}
                </div>
                <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {ticket.description.substring(0, 100)}...
                </p>
                <div style={ticketStyles.cardMeta}>
                  <span>
                    <span style={{...ticketStyles.badge, ...getBadgeStyle('priority', ticket.priority)}}>
                      {ticket.priority}
                    </span>
                  </span>
                  <span>
                    <span style={{...ticketStyles.badge, ...getBadgeStyle('status', ticket.status)}}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </span>
                  <span style={{ color: '#6b7280' }}>{ticket.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTicketId(ticket.id);
                    setShowEditModal(true);
                  }}
                  style={ticketStyles.buttonSecondary}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteTicket(ticket.id, e)}
                  style={ticketStyles.buttonDanger}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTicket
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTicketCreated}
        />
      )}

      {showEditModal && editingTicketId && (
        <EditTicket
          ticketId={editingTicketId}
          onClose={() => {
            setShowEditModal(false);
            setEditingTicketId(null);
            navigate('/tickets');
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingTicketId(null);
            fetchTickets();
            navigate('/tickets');
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
  },
  logoutBtn: {
    padding: '0.625rem 1.25rem',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default Tickets;
