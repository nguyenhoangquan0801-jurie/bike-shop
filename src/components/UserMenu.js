import React, { useState } from 'react';
import './Auth.css';

function UserMenu({ user, onLogout, onShowAuth, onShowOrders }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
    setShowDropdown(false);
  };

  if (!user) {
    return (
      <button 
        className="auth-btn" 
        onClick={onShowAuth}
        style={{ padding: '8px 16px', fontSize: '14px' }}
      >
        Đăng nhập
      </button>
    );
  }

  return (
    <div className="user-menu" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
      <div className="user-avatar">
        {getInitials(user.fullName)}
      </div>
      <span style={{ color: '#333' }}>Xin chào, {user.fullName.split(' ')[0]}</span>
      
      {showDropdown && (
        <div className="user-dropdown">
          <button className="dropdown-item" onClick={onShowOrders}>
            Đơn hàng của tôi
          </button>
          <button className="dropdown-item">
            Wishlist
          </button>
          <button className="dropdown-item">
            Thông tin tài khoản
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;