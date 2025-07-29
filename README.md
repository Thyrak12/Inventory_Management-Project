# 🏥 Inventory Management System

This is a **full-stack inventory management system** for managing wholesale clothing shop products. It allows business owners to manage products,user, sales, and stock operations efficiently.

---

## 🎯 Objectives

- Manage clothing shop product inventory (CRUD)
- Manage recurring customer orders
- Maintain customer information
- Generate business reports (daily, monthly, yearly)
- User authentication and role-based access (admin/staff)

---

## 🧑‍💼 User Roles

- **Admin**: Full access (product, orders, reports, user management)
- **Staff**: Sales & inventory access only

---

## 🚀 Getting Started

### Frontend Installation

```bash
npm install
npm install react-router
npm install axios
```

> ⚠️ **Note:**  
> - Before committing your work, **create a new branch** and make a **pull request** for team review.  
> - If new packages are installed, **update `README.md`** accordingly.  
> - Do **not push `package-lock.json` or `node_modules/`** to the repository.

---

## 🏗️ Backend Setup (Inventory Management API)

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/inventory-api.git
cd inventory-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=inventory_db
DB_PORT=3306
PORT=3000
```

### 4. Run the Server

```bash
npm run dev
```

Visit the Swagger UI at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧾 Database Schema Overview

The system includes 6 main tables:

- **Users**: Handles authentication and role access (admin, staff)
- **Products**: Base medical product info
- **Product Variants**: Variants like size, packaging
- **Sales**: Sales transactions
- **Sales Records**: Items within a sale
- **Stock Transactions**: Logs for inventory movement (in/out)

---

## 📘 API Features

- `/users`: Create, login, manage roles
- `/products`: CRUD operations
- `/product-variants`: Manage product variations
- `/sales`: Record customer transactions
- `/sale-records`: Line items of each sale
- `/stock-transactions`: Inventory adjustments

---


## ⚙️ Available Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Run backend server with nodemon      |
| `npm start`        | Start backend server (no watch)      |
| `npm run seed`     | Seed database using Faker.js         |

---

## 🛠️ Technologies Used

- Frontend: React, React Router, Axios
- Backend: Express.js, Sequelize ORM, MySQL
- Utilities: Faker.js, Swagger, dotenv

---

## 📜 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT)
