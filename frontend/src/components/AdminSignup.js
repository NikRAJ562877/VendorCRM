import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css'; // Reuse existing styling or create new CSS

const AdminSignup = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admins', { adminId, password });
      setMessage(res.data.message);
      setError('');
      // Optionally navigate to login after a delay:
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      setMessage('');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Create Admin Credential</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div className="form-group">
          <label htmlFor="adminId" className="form-label">Admin ID</label>
          <input
            id="adminId"
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
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
        <button type="submit" className="login-button">Create Admin</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Go to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignup;
