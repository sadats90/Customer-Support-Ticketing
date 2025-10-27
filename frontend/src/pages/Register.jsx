import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authStyles } from '../shared/styles';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.password_confirmation, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.box}>
        <h2 style={{marginBottom: '1.5rem', color: '#1f2937', textAlign: 'center'}}>Register</h2>
        {error && <div style={authStyles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={authStyles.input} />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={authStyles.input} />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={authStyles.input} />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Confirm Password</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required style={authStyles.input} />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={authStyles.select}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={loading ? {...authStyles.button, ...authStyles.buttonDisabled} : authStyles.button}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={authStyles.link}>Already have an account? <Link to="/login" style={{color: '#667eea'}}>Login</Link></p>
      </div>
    </div>
  );
};

export default Register; 