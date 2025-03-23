import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './header.css'; // Import the custom CSS file

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">CRM Sistemi</Link>
        
        {user && (
          <div className="header-user">
            <span className="header-welcome">Hoşgeldiniz, {user.username}</span>
            <button
              onClick={handleLogout}
              className="header-logout-button"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;