import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/VendorNavbar.css';

const VendorNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="vendor-navbar">
      <div className="vendor-navbar-container">
        <div className="vendor-navbar-brand">
          <Link to="/vendor-dashboard">Vendor Portal</Link>
        </div>

        {/* Hamburger Icon */}
        <div className="vendor-navbar-toggle" onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </div>

        <ul className={`vendor-navbar-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/vendor-dashboard" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/vendor-invoices" onClick={() => setMenuOpen(false)}>Upload Invoice</Link></li>
          <li><Link to="/vendor-report" onClick={() => setMenuOpen(false)}>Report View</Link></li>
          <li><Link to="/send" onClick={() => setMenuOpen(false)}>Send</Link></li> 
          <li>
            <button onClick={handleLogout} className="vendor-logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default VendorNavbar;
