import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Về Bike Shop</h1>
        <p>Chuyên cung cấp các loại xe đạp chất lượng cao với giá cả hợp lý</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <div className="about-text">
            <h2>Câu chuyện của chúng tôi</h2>
            <p>
              Bike Shop được thành lập vào năm 2015 với sứ mệnh mang đến cho người dân Việt Nam 
              những chiếc xe đạp chất lượng cao, an toàn và phù hợp với mọi nhu cầu.
            </p>
            <p>
              Từ một cửa hàng nhỏ, chúng tôi đã phát triển thành một trong những nhà cung cấp 
              xe đạp uy tín hàng đầu tại Việt Nam với hệ thống cửa hàng trên toàn quốc.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Our Story" />
          </div>
        </div>

        <div className="about-section reverse">
          <div className="about-text">
            <h2>Tầm nhìn của chúng tôi</h2>
            <p>
              Chúng tôi mong muốn trở thành địa chỉ tin cậy hàng đầu cho mọi người yêu thích 
              xe đạp và muốn tìm kiếm phương tiện di chuyển thân thiện với môi trường.
            </p>
            <p>
              Bike Shop không chỉ bán xe đạp mà còn mang đến trải nghiệm mua sắm tuyệt vời 
              và dịch vụ chăm sóc khách hàng tận tâm.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Our Vision" />
          </div>
        </div>
      </div>

      <div className="values-section">
        <h2>Giá trị cốt lõi</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Chất lượng</h3>
            <p>Sản phẩm chính hãng, chất lượng cao với chế độ bảo hành đầy đủ</p>
          </div>
          <div className="value-card">
            <h3>Uy tín</h3>
            <p>Cam kết minh bạch về giá cả và thông tin sản phẩm</p>
          </div>
          <div className="value-card">
            <h3>Đổi mới</h3>
            <p>Luôn cập nhật những mẫu xe đạp mới nhất, công nghệ tiên tiến</p>
          </div>
          <div className="value-card">
            <h3>Phục vụ</h3>
            <p>Đội ngũ nhân viên chuyên nghiệp, tận tâm với khách hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;