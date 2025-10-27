import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authStyles } from '../shared/styles';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.box}>
        <h2 style={{marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center'}}>Login</h2>
        {error && <div style={authStyles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={authStyles.input} />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={authStyles.input} />
          </div>
          <button type="submit" disabled={loading} style={loading ? {...authStyles.button, ...authStyles.buttonDisabled} : authStyles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={authStyles.link}>Don't have an account? <Link to="/register" style={{color: '#667eea'}}>Register</Link></p>
      </div>
    </div>
  );
};

export default Login; 