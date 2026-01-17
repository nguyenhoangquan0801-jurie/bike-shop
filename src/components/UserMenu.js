import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function UserMenu({ user, onLogout, onShowAuth, onShowOrders, cartItemCount = 0 }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Lấy số lượng wishlist từ localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setWishlistCount(wishlist.length);
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateWishlistCount();
    
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    window.addEventListener('cartUpdated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
      window.removeEventListener('cartUpdated', updateWishlistCount);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
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
    navigate('/');
  };

  const handleOrdersClick = () => {
    navigate('/orders');
    setShowDropdown(false);
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setShowDropdown(false);
  };

  const handleAddressClick = () => {
    navigate('/addresses');
    setShowDropdown(false);
  };

  const handleChangePasswordClick = () => {
    navigate('/change-password');
    setShowDropdown(false);
  };

  if (!user) {
    return (
      <button 
        className="auth-btn "
        onClick={onShowAuth}
        style={{ 
          padding: '8px 16px', 
          fontSize: '14px',
          background: '#3498db',
          color: 'white'
        }}
      >
        Đăng nhập
      </button>
    );
  }

  const orderCount = user.orderCount || 0;


  return (
    <div className="user-menu" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (!showDropdown) setShowDropdown(true);
      }}>
      <div className="user-avatar">
        {getInitials(user.fullName)}
        {(wishlistCount > 0 || cartCount > 0) && (
          <span className="notification-dot"></span>
        )}
      </div>
      <span className="user-name">Xin chào, {user.fullName.split(' ')[0]}</span>
      
      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-avatar large">{getInitials(user.fullName)}</div>
            <div className="user-dropdown-info">
              <div className="dropdown-username">{user.fullName}</div>
              <div className="dropdown-useremail">{user.email}</div>
            </div>
        </div>
        <button className="dropdown-item" onClick={handleProfileClick}>
            Thông tin tài khoản
          </button>
          
          <button className="dropdown-item" onClick={handleWishlistClick}>
            Danh sách yêu thích
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </button>
          
          <button className="dropdown-item" onClick={handleCartClick}>
            Giỏ hàng
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          
          {user.role === 'admin' && (
            <button className="dropdown-item admin-item" onClick={() => navigate('/admin')}>
              Quản trị viên
            </button>
          )}
          
          <div className="dropdown-divider"></div>
          
          <button className="dropdown-item logout" onClick={handleLogout}>
            Đăng xuất
            <span className="role-tag">{user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;