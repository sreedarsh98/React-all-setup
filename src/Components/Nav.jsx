import React from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.firstName 
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` 
    : user?.email || 'User';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h4>Welcome, {displayName}!</h4>
        </div>
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;