# Health Mart Server

Backend server for Health Mart, an online pharmacy platform. Built with Express.js, TypeScript, and Prisma.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Features
- **User Roles**: Supports Admin, Seller, and Customer roles.
- **Authentication**: Secure authentication using Better Auth.
- **Medicine Management**:
    - Sellers can add, update, and delete medicines.
    - Public access to view medicines and categories.
- **Order Management**:
    - Customers can place orders and view history.
    - Sellers can manage orders and update status.
    - Admins can view all orders.
- **Seller Requests**: Customers can request to become sellers; Admins can approve/reject.
- **Reviews**: Customers can leave reviews for products/sellers.
- **Admin Dashboard**: Comprehensive management of users, medicines, categories, and orders.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Utilities**:
    - `cors` for Cross-Origin Resource Sharing
    - `nodemailer` for email services
    - `dotenv` for environment configuration

## Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL installed and running
- npm (or yarn/pnpm)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd healthmart-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure the following variables (see [Environment Variables](#environment-variables)).

4. **Database Setup:**
   Ensure your PostgreSQL database is running, then run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. **Run the server:**
   Start the development server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000` (or the port specified in `.env`).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
APP_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/healthmart?schema=public"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APP_USER=your_email_user
APP_PASS=your_email_password
```

## Project Structure

```
src/
├── config/         # Configuration files (env vars, etc.)
├── generated/      # Generated files (e.g., Prisma enums)
├── helper/         # Helper functions (error handling, etc.)
├── libs/           # Library configurations (Auth, Prisma)
├── middlewares/    # Express middlewares (Auth guards)
├── modules/        # Feature-based modules
│   ├── admin/
│   ├── customer/
│   ├── medicine/
│   ├── order/
│   └── seller/
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## API Endpoints

### Auth
- Endpoints handled by `better-auth`. Base path: `/api/auth/*`

### Medicine (`/api/medicine`)
- `GET /category` - Get medicine categories
- `GET /` - Get all medicines
- `GET /:id` - Get medicine by ID

### Seller (`/api/seller`)
- `GET /medicine` - Get all medicines by seller
- `POST /medicine` - Add new medicine
- `PATCH /medicine/:id` - Update medicine info
- `DELETE /medicine/:id` - Delete medicine
- `GET /orders` - Get seller orders
- `PATCH /orders/:id` - Update order status

### Order (`/api/order`)
- `POST /` - Create a new order
- `GET /` - Get all user orders
- `GET /:id` - Get order info by ID

### Customer (`/api/customer`)
- `POST /seller-request` - Request to become a seller
- `POST /reviews` - Create a review

### Admin (`/api/admin`)
- `GET /users` - Get all users
- `PATCH /users/:id` - Update user
- `GET /medicines` - Get all medicines
- `GET /orders` - Get all orders
- `POST /categories` - Create category
- `GET /categories` - Get all categories
- `PATCH /categories/:id` - Update category
- `GET /seller-req` - Get all seller requests
- `GET /update/:sellerId` - Update seller request status
