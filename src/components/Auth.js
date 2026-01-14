import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'
import './Auth.css';

const USE_BACKEND = true;
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
      
      console.log(' Đang đăng nhập với Google...');
      
      // Decode Google token với jwt-decode
    const token = credentialResponse.credential;
    const decodedToken = jwt_decode(token);
    
    console.log('📄 Decoded token:', decodedToken);
    
    const { sub: googleId, email, name: fullName, picture: avatar } = decodedToken;
    
    if (!email) {
      throw new Error('Không nhận được email từ Google');
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email);

    if (!user) {
        // Tạo user mới từ Google
        user = {
          id: Date.now(),
          googleId,
          email,
          fullName: fullName || email.split('@')[0],
          avatar: avatar || '',
          isGoogleUser: true,
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Gửi email
        if (USE_BACKEND) {
          try {
            await fetch(`${BACKEND_URL}/send-welcome-email`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                name: fullName || email.split('@')[0]
              })
            });
            console.log(` [REAL EMAIL] Gửi email chào mừng đến ${email}`);
          } catch (emailError) {
            console.log(' Không thể gửi email cho user Google:', emailError);
          }
        }
      }else {
        // Cập nhật thông tin cho user cũ (nếu cần)
        user.googleId = googleId;
        user.isGoogleUser = true;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Lưu thông tin đăng nhập
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('googleToken', token);
      
      // Thông báo thành công
      onLogin(user);
      onClose();
      
      alert(` Chào mừng ${fullName}! Đăng nhập Google thành công.`);
      
      } catch (error) {
      console.error('Google login error:', error);
      setErrors({ general: `Đăng nhập Google thất bại: ${error.message || 'Vui lòng thử lại.'}` });
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
        console.log(` [SIMULATED] Gửi thông báo đăng nhập đến ${user.email}`);
        console.log(` ${user.fullName} vừa đăng nhập vào tài khoản lúc ${new Date().toLocaleString('vi-VN')}`);
        
        // Thông báo thành công
        onLogin(user);
        onClose();
        
        alert(` Chào mừng ${user.fullName} quay trở lại!`);
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
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
      
      let emailSentSuccess = false;
      let emailMessage = '';
      
      if (USE_BACKEND) {
        try {
          // Gửi email thật qua backend
          const emailResponse = await fetch(`${BACKEND_URL}/send-welcome-email`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: registerData.email,
              name: registerData.fullName
            })
          });
          
          if (!emailResponse.ok) {
            throw new Error(`HTTP error! status: ${emailResponse.status}`);
          }
          
          const emailResult = await emailResponse.json();
          
          if (emailResult.success) {
            emailSentSuccess = true;
            emailMessage = ' Đăng ký thành công! Email chào mừng đã được gửi đến hộp thư của bạn.';

            console.log(' Email thật đã được gửi:', emailResult.messageId);
          } else {
            emailMessage = ' Đăng ký thành công! (Nhưng không thể gửi email)';
            console.warn(' Gửi email thất bại:', emailResult.message);
          }
        } catch (emailError) {
          emailMessage = ' Đăng ký thành công! (Lỗi kết nối email server)';
          console.error(' Lỗi kết nối email server:', emailError);
        }
      } else {
        // Nếu không dùng backend, vẫn mô phỏng
        console.log(` [SIMULATED] Gửi email chào mừng đến ${registerData.email}`);
        console.log(` [SIMULATED] Gửi email xác nhận đến ${registerData.email}`);
        emailMessage = ' Đăng ký thành công! Email xác nhận đã được gửi (mô phỏng).';
      }
      
      // Hiển thị thông báo thành công
      setSuccessMessage(emailMessage);
      
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
                {USE_BACKEND 
                  ? ' Email thật sẽ được gửi qua backend' 
                  : ' Email được mô phỏng trong Console (F12)'}
              </small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;