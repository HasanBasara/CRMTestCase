import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Müşteri Listesi</Link>
        
        {user && (
          <div className="flex items-center">
            <span className="mr-4">Hoşgeldiniz, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 py-1 px-3 rounded"
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