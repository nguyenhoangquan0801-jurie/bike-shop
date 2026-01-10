import React, { useState } from 'react';
import './Auth.css';

function Auth({ onClose, onLogin, onRegister }) {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
        onClose();
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      }
    } catch (error) {
      setErrors({ general: 'Đã có lỗi xảy ra' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateRegister();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some(u => u.email === registerData.email)) {
setErrors({ email: 'Email này đã được đăng ký' });
        return;
      }

      const newUser = {
        id: Date.now(),
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        setActiveTab('login');
        setSuccessMessage('');
        setRegisterData({ fullName: '', email: '', password: '', confirmPassword: '' });
      }, 2000);
    } catch (error) {
      setErrors({ general: 'Đã có lỗi xảy ra' });
    } finally {
      setIsLoading(false);
    }
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
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;