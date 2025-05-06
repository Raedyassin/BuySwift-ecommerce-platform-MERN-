# BuySwift — MERN Stack eCommerce Project

**BuySwift** is a full-featured eCommerce web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). The project includes robust authentication, admin dashboards, product management, payment integrations (PayPal & Cash on Delivery), and dynamic filtering — all created from scratch in **75 days of learning and development**.

---

## 🧠 Technologies Used

- **Frontend**: React, Redux Toolkit, RTK Query, Tailwind CSS, Motion, Axios, React Icons, React Toastify, React Slick, Chart.js, ApexCharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Bcrypt.js, Cookie-Parser, Dotenv, CORS
- **Payments**: PayPal API, Cash on Delivery
- **Charts**: ApexCharts, Chart.js

---

## 🚀 Key Features

### ✅ User Features

- Register, login, and update profile (name, email, password, image)
- Browse products, search, view details, and apply filters
- Add to favorites or cart (stored in `localStorage`)
- Rate and comment on products (only one per product, editable)
- Place orders with:
  - 💵 Cash on Delivery
  - 💳 PayPal (temp orders stored to handle incomplete transactions)
- Track order status: `Pending`, `Packed`, `Transit`, `Delivered`
- View order history with full details
- Step-by-step checkout: cart ➝ shipping ➝ confirmation

---

### 🛠️ Admin Features

- 📊 Dashboard with:
  - Total users, products, orders, and revenue
  - Top 10 best-selling and highest-rated products
  - Order payment statuses
- 👤 User Management:
  - Promote to admin, update user info, or delete users
  - Filter users by ID, name, email, date, or role
- 📦 Product Management:
  - Full CRUD operations
  - Table filtering by ID, name, price, brand, quantity, date, category, rating
- 🗂️ Category Management:
  - Create, update, delete, and view categories
- 📬 Order Management:
  - Filter by ID, date, status, total price, payment method
  - Update statuses: Pending ➝ Packed ➝ Transit ➝ Delivered
  - Mark as paid (for cash on delivery)
  - Admin-only ability to cancel orders (until now)

---

### 📦 Backend Highlights (Detailed)

- **Modular RESTful API Design**  
  The backend is structured into separate modules for `users`, `products`, `orders`, and `categories`, each with its own routes, controllers, and models — following best practices for scalability and maintainability.

- **Authentication & Authorization**  
  Secure login and signup are implemented using **JWT (JSON Web Tokens)**. The app uses **access tokens stored in cookies**, and access to admin routes is protected with **role-based middleware** that checks if the user is an admin.

- **MongoDB & Mongoose**  
  All data is stored in **MongoDB**, and **Mongoose** is used for schema modeling, data validation, and querying. Collections include:
  - `Users`
  - `Products`
  - `Orders`
  - `Categories`
  - `TempPaypalOrders` (temporary orders during PayPal checkout)

- **Image Uploads with Multer**  
  File uploads (e.g. product or user images) are handled using **Multer**, a middleware that processes multipart/form-data. Uploaded files are stored locally and the file path is saved in the database. and product image start by "product-..." and user start buy "user-..."

- **Handling Incomplete PayPal Orders**  
  When a user selects **PayPal** as the payment method, a new record is created in a temporary collection called `TempPaypalOrder`. If the payment is completed, the record is deleted and added to the real `Order` collection. This protects against incomplete or abandoned payments.

- **Order Status System**  
  Admins manage order progress with clearly defined statuses:
  - `Pending`: Created but not yet processed
  - `Packed`: Order prepared for shipment
  - `Transit`: Order shipped
  - `Delivered`: Order received by customer
  - `Paid`: Marked by admin for Cash on Delivery
  - `Cancelled`: Only admins can cancel orders

- **Dashboard Analytics APIs**  
  The backend provides aggregated data for:
  - Total users, Total products, Total ordersm, Total revenue
  - Top 10 sold and top-rated products
  - Order status breakdown (e.g., how many are packed, pending, etc.)

- **Clean and Maintainable Code Structure**  
  Each logic part is separated into:
  - `routes/`: Defines endpoints
  - `controllers/`: Business logic
  - `models/`: Mongoose schemas
  - `middleware/`: Auth checks and error handling
  - `utils/`: Helper functions like file upload or token handling

---

## 🎨 Frontend Pages

### 🧑 General

- Home, Shop, Favorites, Cart
- Product Details, Login, Register

### 👤 User Area

- Profile with image, name, email, and password management
- Cart ➝ Shipping ➝ Order confirmation flow
- Order history and tracking
- Product commenting and rating

### 🛠️ Admin Area

- Dashboard overview with charts and metrics
- Manage products (CRUD, filter, search)
- Manage categories
- Manage users
- Manage and update order statuses

---

## 📈 What I Learned

- Strong understanding of full-stack **MERN architecture**
- REST API design and **role-based auth system**
- File uploading, image handling, and PayPal integration
- Practical use of **Redux Toolkit** and **RTK Query**
- Dynamic admin dashboards and filterable data tables
- Building responsive, reusable UI components with Tailwind

---

> 🧑‍💻 Project Duration: **75 Days**  
> 📁 Project Name: `BuySwift`
