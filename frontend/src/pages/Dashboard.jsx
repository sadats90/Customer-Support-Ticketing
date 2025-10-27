import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.navTitle}>Support Ticketing System</h1>
        <div style={styles.navRight}>
          <button 
            onClick={() => navigate('/tickets')}
            style={styles.navButton}
          >
            Tickets
          </button>
          <span style={styles.userInfo}>Welcome, {user?.name} ({user?.role})</span>
          <button 
            onClick={handleLogout} 
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            style={{...styles.logoutBtn, background: hoverLogout ? '#b91c1c' : '#dc2626'}}
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={styles.content}>
        <h2 style={styles.heading}>Dashboard</h2>
        <div style={styles.info}>
          <p style={styles.infoParagraph}><span style={styles.infoStrong}>Name:</span>{user?.name}</p>
          <p style={styles.infoParagraph}><span style={styles.infoStrong}>Email:</span>{user?.email}</p>
          <p style={styles.infoParagraph}><span style={styles.infoStrong}>Role:</span>{user?.role}</p>
        </div>
        <div style={styles.placeholder}>
          <h3 style={styles.placeholderHeading}>Tickets and Chat features coming soon...</h3>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc' },
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
  navButton: {
    padding: '0.625rem 1.25rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.2s'
  },
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
    fontWeight: '500',
    transition: 'background 0.2s'
  },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  heading: {
    color: '#1f2937',
    marginBottom: '1.5rem',
    fontSize: '1.75rem',
    fontWeight: '600'
  },
  info: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb'
  },
  infoParagraph: {
    margin: '0.75rem 0',
    color: '#4b5563',
    fontSize: '1rem'
  },
  infoStrong: {
    color: '#1f2937',
    fontWeight: '600',
    marginRight: '0.5rem'
  },
  placeholder: {
    background: 'white',
    padding: '3rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  },
  placeholderHeading: {
    color: '#9ca3af',
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '500'
  }
};

export default Dashboard; 