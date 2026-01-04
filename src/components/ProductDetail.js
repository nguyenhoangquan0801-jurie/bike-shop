import React from 'react';
import './ProductDetail.css';

function ProductDetail({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <p className="product-category">{product.category}</p>
            <p className="product-price">{formatPrice(product.price)}</p>
            
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
                className="add-to-cart-btn"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                Thêm vào giỏ hàng
              </button>
              <button className="buy-now-btn">Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;