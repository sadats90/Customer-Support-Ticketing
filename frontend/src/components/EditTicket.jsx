import React, { useState, useEffect } from 'react';
import { ticketsAPI } from '../api/tickets';
import { ticketStyles } from '../shared/componentStyles';

const EditTicket = ({ ticketId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await ticketsAPI.getOne(ticketId);
      setFormData({
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority
      });
    } catch (err) {
      setError('Failed to load ticket');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await ticketsAPI.update(ticketId, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={ticketStyles.modal} onClick={onClose}>
        <div style={ticketStyles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={ticketStyles.modal} onClick={onClose}>
      <div style={ticketStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={ticketStyles.modalHeader}>
          <h2>Edit Ticket</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.875rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={ticketStyles.formGroup}>
            <label style={ticketStyles.label}>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={ticketStyles.input}
            />
          </div>

          <div style={ticketStyles.formGroup}>
            <label style={ticketStyles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={ticketStyles.textarea}
            />
          </div>

          <div style={ticketStyles.formGroup}>
            <label style={ticketStyles.label}>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={ticketStyles.input}
              placeholder="e.g., Technical, Billing, General"
            />
          </div>

          <div style={ticketStyles.formGroup}>
            <label style={ticketStyles.label}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={ticketStyles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={ticketStyles.buttonSecondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={loading ? {...ticketStyles.button, opacity: 0.6} : ticketStyles.button}
            >
              {loading ? 'Updating...' : 'Update Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicket;
