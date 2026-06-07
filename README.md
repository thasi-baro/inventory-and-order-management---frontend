# 📦 E-Store Pro: Inventory & Orders Management System

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-leaf)

Đây là hệ thống Quản lý Kho hàng và Đơn hàng (Inventory & Orders Management) được phát triển dưới dạng Fullstack Web Application. Dự án cung cấp giải pháp toàn diện để quản lý sản phẩm, xử lý đơn hàng, theo dõi tồn kho và phân tích doanh thu qua Dashboard trực quan.

## 🔗 Liên kết dự án (Project Links)

- **🚀 Live Demo (Frontend):** `https://inventory-and-order-management-fron.vercel.app/`
- **⚙️ Live API (Backend):** `https://inventory-and-order-management-backend-5zg8.onrender.com`
- **💻 Frontend Repository:** [thasi-baro/inventory-and-order-management---frontend](https://github.com/thasi-baro/inventory-and-order-management---frontend)
- **🗄️ Backend Repository:** [thasi-baro/inventory-and-order-management---backend](https://github.com/thasi-baro/inventory-and-order-management---backend)

---

## ✨ Tính năng nổi bật (Key Features)

### 🔐 1. Authentication & Security

- Đăng ký / Đăng nhập với bảo mật JWT (JSON Web Token) kết hợp HTTP-only Cookies.
- Quản lý cài đặt tài khoản: Cho phép người dùng tùy chỉnh tên hiển thị và "Ngưỡng cảnh báo sắp hết hàng" (Low Stock Threshold) cho riêng mình.
- Dữ liệu độc lập: Mỗi người dùng chỉ quản lý và xem được dữ liệu của chính mình.

### 📦 2. Product Management

- CRUD Sản phẩm toàn diện (Tên, Mô tả, Giá, Số lượng tồn kho, Hình ảnh).
- Xem danh sách sản phẩm (phân trang, tìm kiếm theo tên, lọc theo giá tiền).
- Upload hình ảnh trực tiếp lên **Cloudinary**.
- Validation chặt chẽ form nhập liệu với `Zod` và `React Hook Form`.
- Cảnh báo sản phẩm còn tồn kho ít theo ngưỡng (Low Stock Threshold) mà người dùng tùy chỉnh.

### 🛒 3. Order & Inventory Management

- Khởi tạo đơn hàng từ danh sách sản phẩm hiện có.
- Xem danh sách đơn hàng (phân trang, lọc theo trạng thái đơn hàng).
- Hệ thống tự động trừ số lượng tồn kho (Auto-deduct stock) khi tạo đơn hàng thành công.
- Tự động hoàn kho (Restock) nếu đơn hàng bị chuyển sang trạng thái Hủy (`Cancelled`).
- Cập nhật linh hoạt trạng thái đơn hàng: `Pending` ➔ `Completed` ➔ `Cancelled`.
- Lưu trữ tạm thời, khi đã thêm sản phẩm vào giỏ hàng và sang trang khác thì giỏ hàng vẫn giữ thông tin đến khi quay lại trang.
- Tích hợp `Nodemailer` tự động gửi email thông báo hóa đơn và trạng thái đơn hàng cho khách hàng.

### 📊 4. Interactive Dashboard

- **Theo dõi các chỉ số:** Doanh thu tháng này cùng với phần trăm tăng/giảm trưởng so với tháng trước, số lượng đơn hàng tháng này, số lượng sản phẩm
- **Doanh số theo ngày:** Biểu đồ Area Chart thống kê doanh thu trong 30 ngày qua.
- **Trạng thái đơn hàng:** Biểu đồ Donut Chart trực quan hóa tỷ lệ đơn hàng.
- **Inventory Health:** Biểu đồ Pie Chart cảnh báo hàng sắp hết/hết hàng dựa trên ngưỡng cảnh báo tùy chỉnh của người dùng.
- **Top 5 sản phẩm bán chạy:** Theo dõi 5 sản phẩm bán chạy nhất
- **Tối ưu hiệu suất với Redis:** Áp dụng cơ chế Caching cho các API thống kê và tự động dọn dẹp bộ nhớ (Cache Invalidation) khi có thay đổi dữ liệu (Thêm/Sửa/Xóa), giúp Dashboard tải ngay lập tức (0ms delay).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

**Frontend:**

- React.js (Vite)
- Tailwind CSS & Shadcn UI (UI Components)
- Zustand (Global State Management)
- React Hook Form + Zod (Form Validation)
- Recharts (Data Visualization / Charts)
- Lucide React (Icons)
- Axios (HTTP Client)

**Backend:**

- Node.js & Express.js (RESTful API Architecture)
- MongoDB & Mongoose (Database & ODM)
- JSON Web Token (JWT) & Bcryptjs (Authentication & Password Hashing)
- Cloudinary & Multer (Image Storage & File Handling)
- Redis (Upstash) (Caching & Performance Optimization)
- Nodemailer (Automated Email Services)

---

## Test account:

- Email:

```bash
bao@gmail.com
```

- Password:

```bash
111111
```

## 🚀 Hướng dẫn cài đặt chạy ở máy (Local Setup Instructions)

Yêu cầu môi trường: Cài đặt sẵn **Node.js** 

### Bước 1: Clone 2 kho lưu trữ về máy

```bash
# Clone Backend
git clone [https://github.com/thasi-baro/inventory-and-order-management---backend.git](https://github.com/thasi-baro/inventory-and-order-management---backend.git)
```

```bash
# Clone Frontend
git clone [https://github.com/thasi-baro/inventory-and-order-management---frontend.git](https://github.com/thasi-baro/inventory-and-order-management---frontend.git)
```

### Bước 2: Cài đặt & Cấu hình Backend

```bash
cd inventory-and-order-management---backend
npm install
```

### Bước 3: Tải và cài đặc file .env (Backend/.env)

### Bước 4: Cài đặt & Cấu hình Fronend

```bash
cd inventory-and-order-management---frontend
npm install
```
