import React, { useState } from 'react';
import { ticketsAPI } from '../api/tickets';
import { ticketStyles } from '../shared/componentStyles';

const CreateTicket = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await ticketsAPI.create(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={ticketStyles.modal} onClick={onClose}>
      <div style={ticketStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={ticketStyles.modalHeader}>
          <h2>Create New Ticket</h2>
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
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
