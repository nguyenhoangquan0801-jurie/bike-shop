import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Chào mừng đến với Bike Shop</h1>
          <p>Khám phá bộ sưu tập xe đạp chất lượng cao với giá cả hợp lý</p>
          <Link to="/products" className="cta-button">
            Mua sắm ngay
          </Link>
        </div>
        <div className="hero-image">
          <img src="https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-red-riding-bicycle-illustration-image_1402467.jpg" alt="Bike Shop" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Tại sao chọn Bike Shop?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Giao hàng nhanh</h3>
            <p>Giao hàng toàn quốc trong 2-3 ngày làm việc</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Bảo hành 2 năm</h3>
            <p>Bảo hành chính hãng cho tất cả sản phẩm</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Thanh toán an toàn</h3>
            <p>Đa dạng phương thức thanh toán</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>Hỗ trợ kỹ thuật</h3>
            <p>Đội ngũ kỹ thuật viên chuyên nghiệp</p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-section">
        <h2>Danh mục nổi bật</h2>
        <div className="categories-grid">
          <Link to="/products?category=Địa hình" className="category-card">
            <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Địa hình" />
            <div className="category-overlay">
              <h3>Xe địa hình</h3>
              <p>Khám phá ngay →</p>
            </div>
          </Link>
          
          <Link to="/products?category=Thể thao" className="category-card">
            <img src="https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Thể thao" />
            <div className="category-overlay">
              <h3>Xe thể thao</h3>
              <p>Khám phá ngay →</p>
            </div>
          </Link>
          
          <Link to="/products?category=Trẻ em" className="category-card">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Trẻ em" />
            <div className="category-overlay">
              <h3>Xe trẻ em</h3>
              <p>Khám phá ngay →</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;