import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/auth';
import '../css/Login.css';

const Login = ({ setUser }) => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient({
        endpoint: '/auth/login',
        method: 'POST',
        body: { vendorId, password }
      });

      if (res.message === 'Login successful') {
        const user = {
          vendorId: res.user.vendorId,
          name: res.user.name || '',
          email: res.user.email || '',
          role: res.user.role
        };

        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        if (res.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (res.user.role === 'employee') {
          navigate('/employee-dashboard');
        } else if (res.user.role === 'vendor') {
          navigate('/vendor-dashboard');
        } else {
          setError('Unknown role, please contact admin.');
        }
      }
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Image section */}
        <div className="login-image">
          <img src="AutorexXZ.png" alt="Autorex Logo" />
        </div>

        {/* Form section */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Login</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="vendorId" className="form-label">User ID</label>
            <input
              id="vendorId"
              type="text"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button">Sign In</button>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Need an admin account? <Link to="/admin-signup">Create one here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
