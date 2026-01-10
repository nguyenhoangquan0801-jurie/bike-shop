# Bike Shop 🛒🚴‍♂️

Bike Shop là một **website bán xe đạp** được xây dựng nhằm mô phỏng một cửa hàng thương mại điện tử cơ bản.
Dự án tập trung vào **hiển thị sản phẩm, quản lý dữ liệu bằng Fake API** và dễ dàng mở rộng thêm các chức năng như giỏ hàng, tìm kiếm, lọc sản phẩm.

---

## 🎯 Mục tiêu dự án

- Luyện tập xây dựng giao diện với **React**
- Hiểu cách tổ chức cấu trúc project frontend
- Làm việc với **Fake REST API** thông qua `db.json`
- Chuẩn bị nền tảng để mở rộng sang dự án Fullstack

---

## 🚀 Demo

🔗 Demo online: *(chưa deploy)*  
📸 Screenshot: *(có thể bổ sung ảnh giao diện tại đây)*

---

## 🧰 Công nghệ sử dụng

- ⚛️ **ReactJS** – xây dựng UI
- 📦 **Node.js & npm** – quản lý package
- 🎨 **CSS** – styling giao diện
- 📀 **JSON Server** – Fake REST API
- 📁 **db.json** – lưu dữ liệu sản phẩm xe đạp

---

## 📥 Cài đặt & Chạy dự án

### 1️⃣ Clone repository

```bash
git clone https://github.com/nguyenhoangquan0801-jurie/bike-shop.git
cd bike-shop
```

### 2️⃣ Cài đặt thư viện

```bash
npm install
```

### 3️⃣ Chạy frontend (React)

```bash
npm start
```

➡️ Truy cập ứng dụng tại: **http://localhost:3000**

---

## 📀 Chạy Fake API với JSON Server

### Cài JSON Server (nếu chưa có)

```bash
npm install -g json-server
```

### Chạy server

```bash
npx json-server --watch db.json --port 3001
```

➡️ API chạy tại: **http://localhost:3001**

Ví dụ endpoint:
- `GET /products` – Lấy danh sách xe đạp
- `GET /products/:id` – Lấy chi tiết sản phẩm

---

## 📂 Cấu trúc thư mục

```
bike-shop/
├─ public/                # File tĩnh
├─ src/
│  ├─ components/         # Component dùng chung
│  ├─ pages/              # Các trang chính
│  ├─ services/           # Gọi API (nếu có)
│  ├─ App.js              # Root component
│  └─ index.js            # Entry point
├─ db.json                # Fake database
├─ package.json
└─ README.md
```

---

## ✨ Tính năng hiện có

✔ Hiển thị danh sách xe đạp  
✔ Lấy dữ liệu từ Fake API  
✔ Cấu trúc code rõ ràng, dễ mở rộng  

---

## 🔮 Tính năng có thể phát triển thêm

- 🛒 Giỏ hàng
- 🔍 Tìm kiếm & lọc theo loại xe
- 💳 Thanh toán
- 👤 Đăng nhập / đăng ký
- 📱 Responsive cho mobile

---

## 👨‍💻 Tác giả

**nguyenhoangquan0801-jurie**
**HoangNam56**

---

## 📄 License

MIT License
