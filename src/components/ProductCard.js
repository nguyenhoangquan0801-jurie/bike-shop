import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart, toggleWishlist, isInWishlist, openProductDetail }) {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const isOnSale = product.isOnSale && product.discount > 0;

  const getDaysRemaining = () => {
    if (!product.saleEnd) return null;
    const endDate = new Date(product.saleEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  const savings = isOnSale ? product.originalPrice - product.price : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          onClick={() => openProductDetail(product)}
          className="product-image"
        />
        {isOnSale && (
          <div className="product-badges">
            <span className="discount-badge">-{product.discount}%</span>
            {daysRemaining > 0 && daysRemaining <= 7 && (
              <span className="sale-timer">
                ⏰ {daysRemaining}d
              </span>
            )}
          </div>
        )}
      </div>
      <h3 onClick={() => openProductDetail(product)} className="product-title">
        {product.name}
      </h3>
      <p className="product-category">{product.category}</p>

      <div className="product-pricing">
        {isOnSale ? (
          <>
            <div className="price-row">
              <span className="product-price-sale">{formatPrice(product.price)}</span>
              <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="savings-row">
              <span className="discount-saved">
                Tiết kiệm: {formatPrice(savings)}
              </span>
            </div>
          </>
        ) : (
          <span className="product-price">{formatPrice(product.price)}</span>
        )}
      </div>

      <div className="product-actions">
        <button onClick={() => addToCart(product)} className="add-to-cart-btn">
          Thêm vào giỏ
        </button>
        <button 
          onClick={() => toggleWishlist(product)}
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;