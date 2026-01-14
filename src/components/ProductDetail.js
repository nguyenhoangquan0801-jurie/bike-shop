import React from 'react';
import './ProductDetail.css';

function ProductDetail({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const isOnSale = product.isOnSale && product.discount > 0;
  
  // Tính số tiền tiết kiệm
  const savings = isOnSale ? (product.originalPrice - product.price) : 0;
  
  // Tính số ngày còn lại
  const getDaysRemaining = () => {
    if (!product.saleEnd) return null;
    const endDate = new Date(product.saleEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            {isOnSale && (
              <div className="sale-flags">
                <div className="main-sale-flag">
                  <span className="discount-percent">-{product.discount}%</span>
                  <span className="sale-text">GIẢM GIÁ</span>
                </div>
                {daysRemaining > 0 && (
                  <div className="countdown-flag">
                    Còn {daysRemaining} ngày
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="product-detail-info">
            <h2>{product.name}</h2>

            <div className="product-category-badge">
              {product.category}
            </div>

            <div className="product-pricing-detail">
              {isOnSale ? (
                <div className="sale-pricing">
                  <div className="price-display">
                    <span className="final-price">{formatPrice(product.price)}</span>
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  </div>
                  
                  <div className="savings-info">
                    <div className="savings-badge">
                      <span className="savings-amount">Tiết kiệm: {formatPrice(savings)}</span>
                      <span className="savings-percent">(-{product.discount}%)</span>
                    </div>
                  </div>
                  
                  {product.saleEnd && daysRemaining > 0 && (
                    <div className="sale-countdown">
                      <div className="countdown-timer">
                        <span className="countdown-icon">Còn vài phút nữa thôi</span>
                        <span className="countdown-text">
                          Khuyến mãi kết thúc sau: <strong>{daysRemaining} ngày</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="regular-pricing">
                  <span className="regular-price">{formatPrice(product.price)}</span>
                </div>
              )}
            </div>
            
            <div className="product-description">
              <h3>Mô tả sản phẩm</h3>
              <p>Xe đạp {product.name.toLowerCase()} với chất lượng cao, phù hợp cho {product.category.toLowerCase()}.
                Khung xe chắc chắn, hệ thống phanh an toàn, thiết kế hiện đại và tiện lợi.</p>
            </div>
            
            <div className="product-specs">
              <h3>Thông số kỹ thuật</h3>
              <ul>
                <li>Chất liệu: Khung hợp kim nhôm</li>
                <li>Trọng lượng: 12-15kg</li>
                <li>Kích thước bánh: 26-28 inch</li>
                <li>Phù hợp: Người lớn/Trẻ em</li>
                <li>Bảo hành: 2 năm</li>
              </ul>
            </div>
            
            <div className="product-detail-actions">
              <button 
                className={`add-to-cart-btn detail ${isOnSale ? 'sale' : ''}`}
                onClick={() => {
                  onAddToCart(product);
                  alert(`Đã thêm ${product.name} vào giỏ hàng!`);
                }}
              >
                Thêm vào giỏ hàng
              </button>
              <button className={`buy-now-btn detail ${isOnSale ? 'sale' : ''}`}
                onClick={() => {
                  onAddToCart(product);
                  alert(`Đã thêm ${product.name} vào giỏ hàng và sẵn sàng thanh toán!`);
                }}
              >
                Mua ngay
              </button>
            </div>
            
            {isOnSale && (
              <div className="sale-notice">
                <div className="notice-icon">Quà cho bạn</div>
                <div className="notice-content">
                  <strong>Chương trình khuyến mãi:</strong>
                  <p>Áp dụng cho tất cả khách hàng. Giá khuyến mãi có thể kết thúc sớm hơn dự kiến.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;