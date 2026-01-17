// components/Wishlist.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

function Wishlist() {
const [wishlist, setWishlist] = useState([]);
const navigate = useNavigate();

useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
    const updatedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(updatedWishlist);
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
}, []);

const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    alert('Đã xóa khỏi danh sách yêu thích!');
};

const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
    const updatedCart = cart.map(item => 
        item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
    localStorage.setItem('cart', JSON.stringify([
        ...cart, 
        { ...product, cartId: Date.now() + product.id, quantity: 1 }
    ]));
    }
    
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
};

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
};

return (
    <div className="products-page">
    <div className="page-header">
        <h1>Danh sách yêu thích</h1>
        <p>Sản phẩm bạn đã lưu</p>
    </div>

    {wishlist.length === 0 ? (
        <div className="empty-state">
        <div className="empty-icon">Yêu thích</div>
        <h3>Danh sách yêu thích trống</h3>
        <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
        <button 
            className="browse-btn"
            onClick={() => navigate('/products')}
        >
            Khám phá sản phẩm
        </button>
        </div>
    ) : (
        <>
        <div className="products-info">
            <p>Tổng cộng: {wishlist.length} sản phẩm</p>
        </div>
        
        <div className="products-grid">
            {wishlist.map((product) => (
            <div key={product.id} className="product-card">
                <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.isOnSale && (
                    <span className="sale-badge">-{product.discount}%</span>
                )}
                <button 
                    className="wishlist-btn active"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Xóa khỏi yêu thích"
                >
                    Yêu thích
                </button>
                </div>
                <div className="product-info">
                <span className="category">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                
                <div className="price-section">
                    <span className="price">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">
                        {formatPrice(product.originalPrice)}
                    </span>
                    )}
                </div>
                
                <div className="product-actions">
                    <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    >
                    Thêm vào giỏ
                    </button>
                    <button 
                    className="view-detail-btn"
                    onClick={() => navigate(`/product/${product.id}`)}
                    >
                    Xem chi tiết
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </>
    )}
    </div>
);
}

export default Wishlist;