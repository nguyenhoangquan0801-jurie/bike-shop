import React, { useState } from 'react';
import './App.css';

function App() {
const products = [
  { 
    id: 1, 
    name: "Xe đạp địa hình", 
    price: 8500000, 
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    category: "Địa hình" 
  },
  { 
    id: 2, 
    name: "Xe đạp đường phố", 
    price: 6500000, 
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    category: "Đường phố" 
  },
  { 
    id: 3, 
    name: "Xe đạp thể thao", 
    price: 12000000, 
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    category: "Thể thao" 
  },
  { 
    id: 4, 
    name: "Xe đạp đua", 
    price: 15000000, 
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    category: "Đua" 
  },
  { 
    id: 5, 
    name: "Xe đạp trẻ em", 
    price: 3500000, 
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", 
    category: "Trẻ em" 
  },
  { 
    id: 6, 
    name: "Xe đạp gấp", 
    price: 7500000, 
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", 
    category: "Gấp" 
  }];
  const [cart, setCart] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products
  .filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(product => 
    selectedCategory === 'Tất cả' || product.category === selectedCategory
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    setCart(cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
    alert(`Đã tăng số lượng ${product.name} trong giỏ!`);
  } else {
    setCart([...cart, { 
      ...product, 
      cartId: Date.now() + product.id,
      quantity: 1 
    }]);
    alert(`Đã thêm ${product.name} vào giỏ!`);
  }
};

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };
  const clearCart = () => {
  if (cart.length === 0) return;
  if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    setCart([]);
    alert('Đã xóa toàn bộ giỏ hàng!');
  }
};

  const updateQuantity = (cartId, newQuantity) => {
  if (newQuantity < 1) {
    removeFromCart(cartId);
    return;
  }
  setCart(cart.map(item => 
    item.cartId === cartId 
      ? { ...item, quantity: newQuantity }
      : item
  ));
};

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="container">
      <header>
        <h1> Bike Shop</h1>
        <div className="cart-info">
          🛒 Giỏ hàng: {cart.length} sản phẩm
        </div>
      </header>

      <main>
        <h2>Danh sách xe đạp</h2>
        
        {/* Search input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm xe đạp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
  <div className="category-filter">
  {['Tất cả', 'Địa hình', 'Đường phố', 'Thể thao', 'Đua', 'Trẻ em', 'Gấp'].map(category => (
    <button
      key={category}
      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>
  {/* Products grid */}
        <div className="products">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">{formatPrice(product.price)}</p>
              <button onClick={() => addToCart(product)}>
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </main>
      {/* Cart sidebar */}
      <aside className="cart">
        <h3>Giỏ hàng ({cart.reduce((total, item) => total + item.quantity, 0)})</h3>
        {cart.length === 0 ? (
          <p>Chưa có sản phẩm nào</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-info">
            <span className="cart-item-name">{item.name}</span>
            <span className="cart-item-price">{formatPrice(item.price)}</span>
          </div>
          <div className="cart-item-controls">
            <div className="quantity-control">
              <button 
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <div className="cart-item-subtotal">
              {formatPrice(item.price * item.quantity)}
            </div>
                <button 
                  onClick={() => removeFromCart(item.cartId)}
                  className="remove-btn"
                >
                  Xóa
                </button>
              </div>
              </div>
            ))}
            <div className="total">
              <strong>Tổng: {formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity),0))}</strong>
            </div >
            <button onClick={clearCart} className="clear-cart-btn" disabled={cart.length === 0}> Xóa giỏ hàng </button>
            <button className="checkout">Thanh toán</button>
          </div>
        )}
      </aside>

      <footer>
        <p>2025 Bike Shop - Bán xe đạp online</p>
      </footer>
    </div>
  );
}

export default App;
