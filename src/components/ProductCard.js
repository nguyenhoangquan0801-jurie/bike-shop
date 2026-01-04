import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart, toggleWishlist, isInWishlist, openProductDetail }) {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        onClick={() => openProductDetail(product)}
        className="product-image"
      />
      <h3 onClick={() => openProductDetail(product)} className="product-title">
        {product.name}
      </h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">{formatPrice(product.price)}</p>
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