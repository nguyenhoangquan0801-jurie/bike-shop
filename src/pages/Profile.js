// components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
const [user, setUser] = useState(null);
const [orders, setOrders] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
});
const navigate = useNavigate();

useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser) {
    navigate('/');
    return;
    }
    
    setUser(savedUser);
    setFormData({
    fullName: savedUser.fullName || '',
    email: savedUser.email || '',
    phone: savedUser.phone || '',
    address: savedUser.address || ''
    });

    // Load user orders
    const userOrders = JSON.parse(localStorage.getItem(`orders_${savedUser.id}`)) || [];
    setOrders(userOrders);
}, [navigate]);

const handleInputChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value
    });
};

const handleSaveProfile = () => {
    const updatedUser = {
    ...user,
    ...formData,
    updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    alert('Cập nhật thông tin thành công!');
    
    // Update App.js user state through event
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
};

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

if (!user) {
    return <div className="loading">Đang tải...</div>;
}

return (
    <div className="profile-page">
    <div className="page-header">
        <h1>Thông tin tài khoản</h1>
        <p>Quản lý thông tin cá nhân và đơn hàng</p>
    </div>

    <div className="profile-container">
        <div className="profile-sidebar">
        <div className="user-avatar-large">
            {user.fullName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <h3>{user.fullName}</h3>
        <p className="user-email">{user.email}</p>
        <span className={`role-badge ${user.role}`}>
            {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
        </span>
        
        <div className="sidebar-menu">
            <button 
            className={`menu-item ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(true)}
            >
            Chỉnh sửa thông tin
            </button>
            <button 
            className="menu-item"
            onClick={() => navigate('/addresses')}
            >
            Địa chỉ của tôi
            </button>
            <button 
            className="menu-item"
            onClick={() => navigate('/change-password')}
            >
            Đổi mật khẩu
            </button>
            <button 
            className="menu-item"
            onClick={() => navigate('/orders')}
            >
            Đơn hàng của tôi ({orders.length})
            </button>
            <button 
            className="menu-item"
            onClick={() => navigate('/wishlist')}
            >
            Danh sách yêu thích
            </button>
        </div>
        </div>

        <div className="profile-content">
        {isEditing ? (
            <div className="edit-profile">
            <h2>Chỉnh sửa thông tin</h2>
            <div className="form-group">
                <label>Họ và tên</label>
                <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="profile-input"
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="profile-input"
                disabled
                />
                <small className="input-help">Email không thể thay đổi</small>
            </div>
            <div className="form-group">
                <label>Số điện thoại</label>
                <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Nhập số điện thoại"
                />
            </div>
            <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="profile-textarea"
                placeholder="Nhập địa chỉ của bạn"
                rows="3"
                />
            </div>
            <div className="form-actions">
                <button 
                className="save-btn"
                onClick={handleSaveProfile}
                >
                Lưu thay đổi
                </button>
                <button 
                className="cancel-btn"
                onClick={() => {
                    setIsEditing(false);
                    setFormData({
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone || '',
                    address: user.address || ''
                    });
                }}
                >
                Hủy
                </button>
            </div>
            </div>
        ) : (
            <div className="profile-info">
            <div className="info-section">
                <h2>Thông tin cá nhân</h2>
                <div className="info-grid">
                <div className="info-item">
                    <span className="info-label">Họ và tên:</span>
                    <span className="info-value">{user.fullName}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Số điện thoại:</span>
                    <span className="info-value">{user.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">{user.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Ngày tham gia:</span>
                    <span className="info-value">
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </span>
                </div>
                </div>
            </div>

            <div className="info-section">
                <h2>Đơn hàng gần đây</h2>
                {orders.length === 0 ? (
                <p className="no-orders">Bạn chưa có đơn hàng nào</p>
                ) : (
                <div className="recent-orders">
                    {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                        <span className="order-id">Đơn hàng #{order.id}</span>
                        <span className={`order-status ${order.status}`}>
                            {order.status === 'pending' ? 'Chờ xử lý' : 
                            order.status === 'shipped' ? 'Đang giao' : 
                            order.status === 'completed' ? 'Hoàn thành' : 
                            order.status === 'cancelled' ? 'Đã hủy' : order.status}
                        </span>
                        </div>
                        <div className="order-details">
                        <span>{order.items.length} sản phẩm</span>
                        <span>{formatPrice(order.total)}</span>
                        <span>{formatDate(order.date)}</span>
                        </div>
                    </div>
                    ))}
                    {orders.length > 3 && (
                    <button 
                        className="view-all-orders"
                        onClick={() => navigate('/orders')}
                    >
                        Xem tất cả đơn hàng ({orders.length})
                    </button>
                    )}
                </div>
                )}
            </div>
            </div>
        )}
        </div>
    </div>
    </div>
);
}

export default Profile;