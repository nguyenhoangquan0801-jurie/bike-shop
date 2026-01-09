import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart, toggleWishlist, isInWishlist, openProductDetail }) {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const isOnSale = product.isOnSale && product.discount > 0;

  const savings = isOnSale ? product.originalPrice - product.price : 0;

  const getDaysRemaining = () => {
    if (!product.saleEnd) return null;
    const endDate = new Date(product.saleEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  const testStyle = {
    border: isOnSale ? '4px solid #00ff00' : '2px solid #0000ff',
    backgroundColor: isOnSale ? '#f0fff0' : '#ffffff',
    padding: '5px'
  };

  return (
    <div className={`product-card ${isOnSale ? 'sale-item' : ''}`}
    style={testStyle} // THÊM VÀO ĐÂY
      data-product-id={product.id}
      data-is-on-sale={isOnSale}
      >

      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          onClick={() => openProductDetail(product)}
          className="product-image"
        />
        {isOnSale && (
          <div className="product-badges">
            <span className="discount-badge"
            style={{ // THÊM STYLE TEST CHO BADGE
                background: '#ff0000', 
                color: '#ffffff', 
                fontSize: '20px',
                border: '2px solid yellow'
              }}
            >
              TEST-{product.discount}%</span>
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
              <span className="product-price-sale"style={{color: '#ff0000', fontSize: '22px', fontWeight: 'bold'}} // TEST
              >
                SALE: {formatPrice(product.price)}</span>
              <span className="product-price-original"style={{textDecoration: 'line-through red', color: '#666'}} // TEST
              >
                WAS: {formatPrice(product.originalPrice)}</span>
            </div>
            <div className="savings-row">
              <span className="discount-saved"
                style={{color: '#00aa00', fontWeight: 'bold', fontSize: '14px'}} // TEST
              >
                SAVE: {formatPrice(savings)}!
              </span>
            </div>
          </>
        ) : (
          <span className="product-price"style={{color: '#0000ff', fontSize: '18px'}} // TEST
          >
            REGULAR: {formatPrice(product.price)}</span>
        )}
      </div>

      <div className="product-actions">
        <button onClick={() => addToCart(product)} className="add-to-cart-btn"style={{ // TEST BUTTON COLOR
            background: isOnSale ? '#ff0000' : '#3498db',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {isOnSale ? '🛒 SALE ITEM!' : 'Thêm vào giỏ'}
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