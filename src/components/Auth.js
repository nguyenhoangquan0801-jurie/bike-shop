import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const USE_BACKEND = false; // Đặt true khi có backend
const BACKEND_URL = 'http://localhost:5000/api';

function Auth({ onClose, onLogin, onRegister }) {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  console.log('=== AUTH COMPONENT RENDER ===');
  console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
  console.log('Client ID length:', GOOGLE_CLIENT_ID.length);
  console.log('Should show button?', !!GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 10);

  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrors({});
      
      console.log('🔐 Đang đăng nhập với Google...');
      
      // Decode Google token để lấy thông tin
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const { sub: googleId, email, name: fullName, picture: avatar } = payload;
      
      // Lấy users từ localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Tìm user hiện có
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Tạo user mới từ Google
        user = {
          id: Date.now(),
          googleId,
          email,
          fullName,
          avatar,
          isGoogleUser: true,
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Ghi log email chào mừng (trong thực tế sẽ gửi email thật)
        console.log(`📧 [SIMULATED] Gửi email chào mừng đến ${email}`);
        console.log(`👋 Xin chào ${fullName}! Chào mừng đến với Bike Shop từ Google!`);
      }
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('googleToken', token);
      
      // Thông báo thành công
      onLogin(user);
      onClose();
      
      alert(`🎉 Chào mừng ${fullName}! Đăng nhập Google thành công.`);
      
      // Nếu có backend, gửi thông tin đến server
      if (USE_BACKEND) {
        try {
          await fetch(`${BACKEND_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
        } catch (error) {
          console.log('Backend không khả dụng, sử dụng localStorage');
        }
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ general: 'Đăng nhập Google thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: 'Đăng nhập với Google thất bại. Vui lòng thử lại.' });
  };

  // ========== EMAIL/PASSWORD LOGIN ==========
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Tìm user trong localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
      
      if (user) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Ghi log thông báo đăng nhập
        console.log(`📧 [SIMULATED] Gửi thông báo đăng nhập đến ${user.email}`);
        console.log(`🔒 ${user.fullName} vừa đăng nhập vào tài khoản lúc ${new Date().toLocaleString('vi-VN')}`);
        
        // Thông báo thành công
        onLogin(user);
        onClose();
        
        alert(`👋 Chào mừng ${user.fullName} quay trở lại!`);
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      }
      
      // Nếu có backend, đồng bộ với server
      if (USE_BACKEND) {
        try {
          await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
          });
        } catch (error) {
          console.log('Backend không khả dụng');
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ========== REGISTRATION ==========
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateRegister();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Kiểm tra trong localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Kiểm tra email đã tồn tại
      if (users.some(u => u.email === registerData.email)) {
        setErrors({ email: 'Email này đã được đăng ký' });
        return;
      }

      // Tạo user mới
      const newUser = {
        id: Date.now(),
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        emailVerified: false,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Ghi log các email sẽ gửi
      console.log(`📧 [SIMULATED] Gửi email chào mừng đến ${registerData.email}`);
      console.log(`👋 Xin chào ${registerData.fullName}! Chào mừng đến với Bike Shop!`);
      
      console.log(`📧 [SIMULATED] Gửi email xác nhận đến ${registerData.email}`);
      console.log(`✅ Vui lòng xác nhận email của bạn, ${registerData.fullName}!`);
      
      // Hiển thị thông báo thành công
      setSuccessMessage('✅ Đăng ký thành công! Email xác nhận đã được gửi (mô phỏng).');
      
      // Tự động chuyển sang tab đăng nhập sau 3 giây
      setTimeout(() => {
        setActiveTab('login');
        setSuccessMessage('');
        setRegisterData({ 
          fullName: '', 
          email: '', 
          password: '', 
          confirmPassword: '' 
        });
        // Tự động điền email vào form đăng nhập
        setLoginData(prev => ({ ...prev, email: registerData.email }));
      }, 3000);
      
      // Nếu có backend, đồng bộ với server
      if (USE_BACKEND) {
        try {
          await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: registerData.fullName,
              email: registerData.email,
              password: registerData.password
            })
          });
        } catch (error) {
          console.log('Backend không khả dụng');
        }
      }
      
    } catch (error) {
      console.error('Register error:', error);
      setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Vui lòng nhập email';
    if (!loginData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!registerData.email) newErrors.email = 'Vui lòng nhập email';
    if (!registerData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (registerData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    return newErrors;
  };

  const handleSwitchToRegister = () => {
    setActiveTab('register');
    setErrors({});
    setSuccessMessage('');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth-btn" onClick={onClose}>×</button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Đăng nhập
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Đăng ký
          </button>
        </div>

        {GOOGLE_CLIENT_ID && (
          <div className="google-login-section">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="vi"
              width="350"
            />
            <div className="divider">
              <span>hoặc sử dụng email</span>
            </div>
          </div>
        )}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            {errors.general && <div className="auth-error">{errors.general}</div>}
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              {errors.email && <div className="auth-error">{errors.email}</div>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="auth-input"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              {errors.password && <div className="auth-error">{errors.password}</div>}
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            <div className="auth-switch">
              Chưa có tài khoản? <button type="button" onClick={handleSwitchToRegister}>Đăng ký ngay</button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            {successMessage && <div className="auth-success">{successMessage}</div>}
            {errors.general && <div className="auth-error">{errors.general}</div>}
            
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                className="auth-input"
                value={registerData.fullName}
                onChange={handleRegisterChange}
              />
              {errors.fullName && <div className="auth-error">{errors.fullName}</div>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              {errors.email && <div className="auth-error">{errors.email}</div>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="auth-input"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              {errors.password && <div className="auth-error">{errors.password}</div>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                className="auth-input"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
              />
              {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            <div className="auth-switch">
              Đã có tài khoản? <button type="button" onClick={handleSwitchToLogin}>Đăng nhập</button>
            </div>
            <div className="debug-info">
              <small>
                📧 Email được mô phỏng trong Console (F12)
                {USE_BACKEND && ' | 🔗 Đang kết nối backend'}
              </small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;