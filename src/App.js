import React, { useState } from 'react';
import './App.css';

function App() {
  const products = [
    { id: 1, name: "Xe đạp địa hình", price: 8500000, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Xe đạp đường phố", price: 6500000, image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Xe đạp thể thao", price: 12000000, image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Xe đạp đua", price: 15000000, image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`Đã thêm ${product.name} vào giỏ!`);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="container">
      <header>
        <h1>🚴 Bike Shop</h1>
        <div className="cart-info">
          🛒 Giỏ hàng: {cart.length} sản phẩm
        </div>
      </header>

      <main>
        <h2>Danh sách xe đạp</h2>
        <div className="products">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{formatPrice(product.price)}</p>
              <button onClick={() => addToCart(product)}>
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </main>

      <aside className="cart">
        <h3>Giỏ hàng ({cart.length})</h3>
        {cart.length === 0 ? (
          <p>Chưa có sản phẩm nào</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>{formatPrice(item.price)}</span>
              </div>
            ))}
            <div className="total">
              <strong>Tổng: {formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}</strong>
            </div>
            <button className="checkout">Thanh toán</button>
          </div>
        )}
      </aside>

      <footer>
        <p>© 2024 Bike Shop - Bán xe đạp online</p>
      </footer>
    </div>
  );
}

export default App;