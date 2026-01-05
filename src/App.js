import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import { productsAPI } from './api/products';
import './App.css';

function App() {
const sampleProducts = [
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

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products from API:', err);
        setError('Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu...');
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      alert(`Đã xóa ${product.name} khỏi yêu thích!`);
    } else {
      setWishlist([...wishlist, product]);
      alert(`Đã thêm ${product.name} vào yêu thích!`);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };
  const openProductDetail = (product) => {
  setSelectedProduct(product);
  };
  const closeProductDetail = () => {
  setSelectedProduct(null);
  };
  const addToCartFromModal = (product) => {
  addToCart(product);
  };

  const handleConfirmOrder = (orderData) => {
  console.log('Order confirmed:', orderData);
  console.log('Cart items:', cart);
  console.log('Total:', cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  
  alert(`Đơn hàng đã được xác nhận!\nCảm ơn bạn đã mua sắm tại Bike Shop!\nTổng tiền: ${formatPrice(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}`);
  
  setCart([]);
};
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
    <div className="container">
      <header>
        <div className="logo">
            <Link to="/"> Bike Shop</Link>
          </div>
          <nav className="nav-menu">
            <Link to="/">Trang chủ</Link>
            <Link to="/products">Sản phẩm</Link>
            <Link to="/about">Giới thiệu</Link>
          </nav>
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-controls">
            <div className="wishlist-info">
              {wishlist.length}
            </div>
            <div className="cart-info" onClick={() => cart.length > 0 && setShowCheckout(true)}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
          </div>
      </header>

      <main>
        {error && (
            <div className="error-banner">
              <p> {error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">Tải lại</button>
            </div>
          )}
        <Routes>
          <Route path="/" element={<Home products={products.slice(0, 4)} />} />
          <Route path="/products" element={
            <Products 
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
              openProductDetail={openProductDetail}
              
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          } />
          <Route path="/about" element={<About />} />
        </Routes>
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
            <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-btn" disabled={cart.length === 0}> Xóa giỏ hàng </button>
            <button className="checkout" onClick={() => setShowCheckout(true)}disabled={cart.length === 0}>Thanh toán </button>
          </div>
          </div>
        )}
      </aside>

      <footer>
        <div className="footer-content">
            <div className="footer-section">
              <h4>Bike Shop</h4>
              <p>Chuyên cung cấp xe đạp chất lượng cao</p>
            </div>
            <div className="footer-section">
              <h4>Liên hệ</h4>
              <p> 0702972210</p>
              <p> info@bikeshop.com</p>
              <p> 17 đường Linh Xuân,Thủ Đức, Tp.HCM</p>
            </div>
            <div className="footer-section">
              <h4>Liên kết nhanh</h4>
              <Link to="/">Trang chủ</Link>
              <Link to="/products">Sản phẩm</Link>
              <Link to="/about">Giới thiệu</Link>
            </div>
          </div>
          <p className="copyright">© 2025 Bike Shop. All rights reserved.</p>
      </footer>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={closeProductDetail}
          onAddToCart={addToCartFromModal}
        />
      )}
      {showCheckout && (
        <Checkout
          cart={cart}
          total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          onClose={() => setShowCheckout(false)}
          onConfirmOrder={handleConfirmOrder}
        />
      )}
    </div>
    </Router>
  );
}

export default App;
