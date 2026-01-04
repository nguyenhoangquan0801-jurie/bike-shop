import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

function Products({ products, addToCart, toggleWishlist, wishlist, openProductDetail }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');

  // Get category from URL if exists
  const categoryFromUrl = searchParams.get('category');
  if (categoryFromUrl && selectedCategory !== categoryFromUrl) {
    setSelectedCategory(categoryFromUrl);
  }

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'Tất cả' || product.category === selectedCategory
    );

  // Sort products
  let sortedProducts = [...filteredProducts];
  if (sortBy === 'price-asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Update URL
    if (category === 'Tất cả') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Danh sách sản phẩm</h1>
        <p>Khám phá bộ sưu tập xe đạp đa dạng của chúng tôi</p>
      </div>

      <div className="products-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm xe đạp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls-row">
          <div className="category-filter">
            {['Tất cả', 'Địa hình', 'Đường phố', 'Thể thao', 'Đua', 'Trẻ em', 'Gấp'].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sắp xếp mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name">Tên: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <p>Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isInWishlist={wishlist.some(item => item.id === product.id)}
              openProductDetail={openProductDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;