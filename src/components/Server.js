// server.js - Chạy trên port 5000
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Google OAuth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Kết nối với JSON Server (port 3001)
const JSON_SERVER_URL = 'http://localhost:3001';

// ========== API ENDPOINTS ==========

// 1. Google OAuth Authentication
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    
    const { sub, email, name, picture } = ticket.getPayload();
    
    // Kiểm tra user trong JSON Server
    const response = await axios.get(`${JSON_SERVER_URL}/users?email=${email}`);
    let user = response.data[0];
    
    if (!user) {
      // Tạo user mới
      const newUser = {
        googleId: sub,
        email,
        fullName: name,
        avatar: picture,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      
      const createResponse = await axios.post(`${JSON_SERVER_URL}/users`, newUser);
      user = createResponse.data;
      
      // Gửi email chào mừng
      await sendWelcomeEmail(email, name);
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Xác thực Google thất bại' 
    });
  }
});

// 2. Đăng ký với email/password
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Kiểm tra email đã tồn tại
    const response = await axios.get(`${JSON_SERVER_URL}/users?email=${email}`);
    if (response.data.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã được đăng ký' 
      });
    }
    
    // Tạo user mới
    const newUser = {
      fullName,
      email,
      password, // Lưu ý: Production cần hash password
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
    
    const createResponse = await axios.post(`${JSON_SERVER_URL}/users`, newUser);
    const user = createResponse.data;
    
    // Tạo và lưu verification token
    const verificationToken = Math.random().toString(36).substring(2);
    await axios.patch(`${JSON_SERVER_URL}/users/${user.id}`, {
      verificationToken
    });
    
    // Gửi email xác nhận
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, fullName, verificationLink);
    
    // Gửi email chào mừng
    await sendWelcomeEmail(email, fullName);
    
    res.json({ 
      success: true, 
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.',
      userId: user.id 
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đăng ký thất bại' 
    });
  }
});

// 3. Đăng nhập với email/password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user trong JSON Server
    const response = await axios.get(`${JSON_SERVER_URL}/users?email=${email}&password=${password}`);
    const user = response.data[0];
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // Gửi thông báo đăng nhập
    await sendLoginNotification(email, user.fullName);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đăng nhập thất bại' 
    });
  }
});

// 4. Xác nhận đơn hàng và gửi email
app.post('/api/orders/confirm', async (req, res) => {
  try {
    const { order, user } = req.body;
    
    // Lưu order vào JSON Server
    const orderWithId = {
      ...order,
      id: Date.now(),
      userId: user.id,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    await axios.post(`${JSON_SERVER_URL}/orders`, orderWithId);
    
    // Gửi email xác nhận đơn hàng
    await sendOrderConfirmationEmail(user.email, user.fullName, orderWithId);
    
    res.json({
      success: true,
      orderId: orderWithId.id,
      message: 'Đơn hàng đã được xác nhận và email đã được gửi'
    });
    
  } catch (error) {
    console.error('Order confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gửi xác nhận đơn hàng thất bại' 
    });
  }
});

// 5. API gửi email tổng quát
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    const mailOptions = {
      from: `"Bike Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email đã được gửi' });
    
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gửi email thất bại' 
    });
  }
});

// ========== EMAIL TEMPLATES ==========

async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"Bike Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🎉 Chào mừng đến với Bike Shop!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Xin chào ${name}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Bike Shop</strong>.</p>
        <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
        <p>Trân trọng,<br>Đội ngũ Bike Shop</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

async function sendVerificationEmail(to, name, verificationLink) {
  const mailOptions = {
    from: `"Bike Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Xác nhận email - Bike Shop',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Xin chào ${name}!</h2>
        <p>Vui lòng click vào link sau để xác nhận email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>Trân trọng,<br>Bike Shop</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

async function sendLoginNotification(to, name) {
  const now = new Date().toLocaleString('vi-VN');
  
  const mailOptions = {
    from: `"Bike Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔒 Thông báo đăng nhập - Bike Shop',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Xin chào ${name},</p>
        <p>Tài khoản của bạn vừa đăng nhập lúc ${now}.</p>
        <p>Nếu đây không phải là bạn, vui lòng liên hệ ngay.</p>
        <p>Trân trọng,<br>Bike Shop</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login notification sent to ${to}`);
  } catch (error) {
    console.error('Error sending login notification:', error);
  }
}

async function sendOrderConfirmationEmail(to, name, order) {
  const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const mailOptions = {
    from: `"Bike Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📦 Xác nhận đơn hàng #${order.id} - Bike Shop`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Đơn hàng đã được xác nhận!</h2>
        <p>Xin chào ${name},</p>
        <p>Cảm ơn bạn đã đặt hàng. Tổng tiền: ${total.toLocaleString('vi-VN')} đ</p>
        <p>Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
        <p>Trân trọng,<br>Bike Shop</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation sent to ${to}`);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth/Email server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Ready' : 'Not configured'}`);
  console.log(`🔐 Google OAuth: ${CLIENT_ID ? 'Ready' : 'Not configured'}`);
});