# SportShop - Full Stack Sports E-Commerce Platform

A production-grade full-stack e-commerce platform for a local sports shop built with **React**, **Node.js**, **Express**, and **MongoDB**. Features include product browsing, cart management, order processing, user authentication, admin dashboard with analytics, product reviews, wishlists, and more.

---

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **React Router v7** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Recharts** for analytics charts
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication with **bcrypt** password hashing
- **Joi** for input validation
- **Helmet**, **CORS**, **rate limiting** for security
- **Morgan** + **Winston** for logging
- **express-mongo-sanitize** for NoSQL injection protection

---

## Features

### Customer Features
- User registration and login with JWT authentication
- Browse products with search, category filtering, price range, sorting, and pagination
- Product details with image gallery, reviews, and related products
- Shopping cart with quantity management
- Checkout with shipping address and payment method selection
- Order history with status tracking
- Wishlist management
- User profile management with password change

### Admin Features
- Dashboard with revenue, orders, products, and users overview
- Sales analytics with charts (revenue trends, category sales, orders per day)
- Order management with status updates
- Product inventory management with low stock alerts
- User management
- Top selling products tracking

### Security
- JWT-based authentication with role-based access control
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS configuration
- NoSQL injection protection
- Input validation on all endpoints

---

## Project Structure

```
sports-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth endpoints
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & role check
│   │   ├── errorHandler.js    # Centralized error handling
│   │   ├── rateLimiter.js     # API rate limiting
│   │   ├── validate.js        # Joi validation middleware
│   │   └── logger.js          # Request logging (Morgan + Winston)
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── wishlistRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── adminService.js
│   │   └── wishlistService.js
│   ├── seed.js                # Database seeding script
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Spinner, StarRating, ProtectedRoute
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   └── product/       # ProductCard
│   │   ├── hooks/
│   │   │   └── useAppDispatch.ts  # Typed Redux hooks
│   │   ├── pages/
│   │   │   ├── admin/         # AdminDashboard
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductListPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── WishlistPage.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Axios API service layer
│   │   ├── store/
│   │   │   ├── slices/        # Redux slices (auth, cart, product, order, wishlist)
│   │   │   └── store.ts       # Redux store configuration
│   │   ├── utils/
│   │   │   └── constants.ts   # Categories, statuses, helpers
│   │   ├── App.tsx            # Router configuration
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Tailwind imports
│   ├── package.json
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sports-ecommerce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sports-ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Test Accounts

After running `npm run seed` in the backend:

| Role     | Email                | Password    |
|----------|----------------------|-------------|
| Admin    | admin@sportsshop.com | admin123    |
| Customer | customer@test.com    | customer123 |

---

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
| Method | Endpoint             | Description       | Auth |
|--------|----------------------|-------------------|------|
| POST   | /auth/register       | Register user     | No   |
| POST   | /auth/login          | Login user        | No   |
| GET    | /auth/profile        | Get profile       | Yes  |
| PUT    | /auth/profile        | Update profile    | Yes  |
| PUT    | /auth/change-password| Change password   | Yes  |

### Products
| Method | Endpoint               | Description         | Auth  |
|--------|------------------------|---------------------|-------|
| GET    | /products              | List products       | No    |
| GET    | /products/featured     | Featured products   | No    |
| GET    | /products/categories   | Get categories      | No    |
| GET    | /products/:id          | Get product details | No    |
| GET    | /products/:id/related  | Related products    | No    |
| POST   | /products              | Create product      | Admin |
| PUT    | /products/:id          | Update product      | Admin |
| DELETE | /products/:id          | Delete product      | Admin |
| POST   | /products/:id/reviews  | Add review          | Yes   |
| DELETE | /products/:id/reviews  | Delete review       | Yes   |

### Cart
| Method | Endpoint         | Description       | Auth |
|--------|------------------|-------------------|------|
| GET    | /cart             | Get cart           | Yes  |
| POST   | /cart             | Add to cart        | Yes  |
| PUT    | /cart/:itemId     | Update quantity    | Yes  |
| DELETE | /cart/:itemId     | Remove item        | Yes  |
| DELETE | /cart             | Clear cart         | Yes  |

### Orders
| Method | Endpoint           | Description         | Auth  |
|--------|--------------------|---------------------|-------|
| POST   | /orders            | Create order        | Yes   |
| GET    | /orders            | Get user orders     | Yes   |
| GET    | /orders/all        | Get all orders      | Admin |
| GET    | /orders/:id        | Get order details   | Yes   |
| PUT    | /orders/:id/cancel | Cancel order        | Yes   |
| PUT    | /orders/:id/status | Update order status | Admin |

### Wishlist
| Method | Endpoint             | Description           | Auth |
|--------|----------------------|-----------------------|------|
| GET    | /wishlist            | Get wishlist          | Yes  |
| POST   | /wishlist/:productId | Add to wishlist       | Yes  |
| DELETE | /wishlist/:productId | Remove from wishlist  | Yes  |

### Admin
| Method | Endpoint              | Description       | Auth  |
|--------|-----------------------|-------------------|-------|
| GET    | /admin/dashboard      | Dashboard stats   | Admin |
| GET    | /admin/analytics      | Sales analytics   | Admin |
| GET    | /admin/users          | List users        | Admin |
| PUT    | /admin/users/:id/role | Update user role  | Admin |

### Query Parameters (Products)
- `search` - Search by name or description
- `category` - Filter by category
- `minPrice` / `maxPrice` - Price range
- `sort` - Sort by: `price_asc`, `price_desc`, `newest`, `rating`, `popular`
- `page` / `limit` - Pagination (default: page=1, limit=12)

---

## Deployment

### Backend (Render / Railway)
1. Push the repo to GitHub
2. Create a new Web Service on Render/Railway
3. Set the root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)

### Frontend (Vercel)
1. Push the repo to GitHub
2. Import the project on Vercel
3. Set the root directory to `frontend`
4. Framework: Vite
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api/v1`

---

## Architecture

### Backend Architecture
- **MVC + Service Layer Pattern**: Controllers handle HTTP requests, services contain business logic, models define data schemas
- **Centralized Error Handling**: All errors are caught by a global error handler middleware
- **Input Validation**: Joi schemas validate all request payloads before they reach controllers
- **Authentication Middleware**: JWT tokens are verified and user objects are attached to requests
- **Rate Limiting**: Prevents abuse with configurable request limits per IP

### Frontend Architecture
- **Redux Toolkit**: Centralized state management with async thunks for API calls
- **Component-Based**: Reusable components (ProductCard, StarRating, Spinner, etc.)
- **Protected Routes**: Route guards that redirect unauthenticated users to login
- **API Service Layer**: Centralized Axios instance with request/response interceptors
- **TypeScript**: Full type safety across all components and state

---

## License

MIT
