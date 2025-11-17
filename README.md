# E-Commerce Project

A modern, full-stack e-commerce application built with React.js frontend and Spring Boot backend, featuring stunning UI design and comprehensive functionality.

## 🚀 Features

### Frontend (React.js)
- **Modern UI Design**: Stunning glass-morphism effects, gradient backgrounds, and smooth animations
- **Product Catalog**: Advanced filtering with price range, category selection, and sorting options
- **Product Details**: Enhanced product pages with related products carousel and fixed layout
- **Shopping Cart**: Smart cart management with promo code support and real-time updates
- **User Authentication**: Secure login/signup with modern gradient design
- **User Profile**: Complete profile management with image upload capabilities
- **Wishlist**: Save and manage favorite products with heart animations
- **Reviews & Ratings**: Interactive star rating system with customer feedback
- **Promo Codes**: Dynamic discount system with validation
- **Checkout Process**: Streamlined multi-step checkout with address management
- **Order History**: Comprehensive order tracking with status updates
- **Role-Based Access Control**: Secure admin and user role management
- **Admin Panel**: Professional dashboard with statistics and management tools
- **Responsive Design**: Mobile-first design with perfect 4-products-per-row layout
- **Enhanced Navigation**: Modern header with glass-morphism effects and smooth transitions

### Backend (Spring Boot)
- **REST API**: Complete RESTful API with comprehensive endpoints
- **JWT Authentication**: Secure token-based authentication with role claims
- **Role-Based Access Control**: Advanced RBAC with method-level security
- **Database Integration**: PostgreSQL with optimized queries
- **File Upload**: Secure image upload for products and user profiles
- **Security**: BCrypt password encryption, CORS configuration, XSS protection
- **Validation**: Comprehensive input validation and error handling
- **Pagination**: Efficient data loading with sorting and filtering
- **Admin APIs**: Complete admin management with dashboard statistics
- **Related Products**: Smart product recommendation system
- **Promo Code System**: Dynamic discount validation and application

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Latest React with hooks and modern patterns
- **Material-UI (MUI) 5**: Advanced component library with custom theming
- **Redux Toolkit**: State management for cart and orders
- **Axios**: HTTP client with interceptors
- **React Router 6**: Modern routing with protected routes
- **CSS3**: Advanced styling with gradients, animations, and glass-morphism

### Backend
- **Spring Boot 3**: Latest Spring Boot with Java 17+
- **Spring Security 6**: Advanced security with JWT and RBAC
- **Spring Data JPA**: Database operations with custom queries
- **PostgreSQL 15**: Robust relational database
- **JWT**: Secure token-based authentication
- **Maven**: Dependency management and build automation
- **Hibernate**: ORM with optimized entity relationships

## 📁 Project Structure

```
E-Commerce-Project/
├── e-commerce-backend/          # Spring Boot backend
│   ├── src/main/java/com/ecommerce/backend/
│   │   ├── config/             # Configuration classes
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data transfer objects
│   │   ├── entity/             # JPA entities
│   │   ├── repository/         # Data repositories
│   │   ├── security/           # Security configuration
│   │   └── service/            # Business logic
│   ├── src/main/resources/     # Configuration files
│   ├── uploads/                # User uploaded images
│   └── pom.xml                 # Maven dependencies
├── e-commerce-ui/              # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── store/              # Redux store and slices
│   │   ├── config/             # API configuration
│   │   └── images/             # Static images
│   ├── public/                 # Static files
│   └── package.json            # NPM dependencies
├── setup-database.sh           # Database setup script
├── setup-postgres.sql          # Database schema
├── setup-rbac.sh              # Role-based access setup
├── create-admin.sql           # Admin user creation
└── README.md                   # This file
```

## 🚦 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd e-commerce-backend
   ```

2. Configure database in `application.properties`

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd e-commerce-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

### Database Setup
Run the database setup script:
```bash
./setup-database.sh
```

### Role-Based Access Control Setup
Run the RBAC setup script to add roles and create admin user:
```bash
./setup-rbac.sh
```

## 🔧 Configuration

### Backend Configuration
- **Port**: 8081
- **Database**: PostgreSQL
- **JWT Secret**: Configure in application.properties
- **File Upload**: uploads/ directory

### Frontend Configuration
- **Port**: 3000
- **API URL**: http://localhost:8081/api
- **Environment**: Configure in .env file

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove item from cart

### Reviews
- `GET /api/products/{id}/reviews` - Get product reviews
- `POST /api/products/{id}/rating` - Add product review

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (paginated)
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/products` - Get all products (paginated)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - Get all orders (paginated)
- `PUT /api/admin/orders/{id}/status` - Update order status

## 🎯 Key Features Implemented

### Core Functionality
1. **Advanced Authentication System**: JWT with role-based claims and secure token management
2. **Smart Product Catalog**: Advanced filtering, sorting, and search with real-time results
3. **Intelligent Shopping Cart**: Persistent cart with promo codes and quantity management
4. **User Profile System**: Complete profile management with image upload
5. **Wishlist Management**: Save favorites with heart animations and easy management
6. **Review & Rating System**: Interactive star ratings with customer feedback
7. **Dynamic Promo Codes**: Percentage-based discounts with validation
8. **Order Management**: Complete order lifecycle with status tracking
9. **File Upload System**: Secure image handling for products and profiles
10. **Related Products**: Smart recommendation carousel with navigation

### Admin Features
11. **Admin Dashboard**: Statistics overview with modern card design
12. **User Management**: Complete user administration with role updates
13. **Product Management**: Full CRUD operations with image upload
14. **Order Management**: Order status updates and tracking
15. **Role-Based Security**: Method-level protection and route guards

### UI/UX Features
16. **Modern Design System**: Glass-morphism, gradients, and smooth animations
17. **Responsive Layout**: Perfect 4-products-per-row with mobile optimization
18. **Enhanced Navigation**: Modern header with backdrop blur effects
19. **Interactive Elements**: Hover effects, transitions, and micro-interactions
20. **Professional Styling**: Consistent color scheme and typography

## 🔒 Security Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication with role claims
- **Role-Based Access Control**: Advanced RBAC with USER and ADMIN roles
- **Method-Level Security**: @PreAuthorize annotations for fine-grained control
- **Protected Routes**: Frontend route protection based on user roles
- **Session Management**: Secure token storage and automatic refresh

### Data Protection
- **Password Encryption**: BCrypt hashing with salt
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries and JPA protection
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Secure cross-origin resource sharing

### File Security
- **Secure File Upload**: File type validation and size limits
- **Path Traversal Prevention**: Secure file storage and access
- **Image Processing**: Safe image handling and storage

## 📱 Responsive Design

### Device Compatibility
- **Desktop (1200px+)**: 4 products per row with full sidebar
- **Tablet (768px-1199px)**: 2 products per row with collapsible filters
- **Mobile (320px-767px)**: 1 product per row with mobile-optimized navigation

### Design Features
- **Mobile-First Approach**: Optimized for mobile devices
- **Flexible Grid System**: CSS Grid with responsive breakpoints
- **Touch-Friendly Interface**: Large buttons and touch targets
- **Optimized Images**: Responsive images with proper aspect ratios
- **Smooth Animations**: Hardware-accelerated transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Vishvash** - Full Stack Developer

## 🔐 Default Admin Credentials

- **Username**: admin
- **Password**: admin123
- **Email**: admin@ecommerce.com
- **Role**: ADMIN

⚠️ **Important**: Change the default admin password in production!

### Creating Additional Admin Users
```sql
-- Run this SQL to create additional admin users
INSERT INTO users (username, email, password, role, created_at) 
VALUES ('newadmin', 'newadmin@example.com', '$2a$10$...', 'ADMIN', NOW());
```

## 🎭 User Roles

### USER Role
- Browse and purchase products
- Manage personal profile
- View order history
- Add products to wishlist
- Write product reviews

### ADMIN Role
- All USER permissions
- Access admin dashboard
- Manage all users
- Manage all products
- Manage all orders
- View system statistics

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple to Blue (#667eea → #764ba2)
- **Secondary Gradient**: Pink to Red (#f093fb → #f5576c)
- **Accent Colors**: Cyan highlights and success greens
- **Neutral Colors**: Modern grays and whites

### Visual Effects
- **Glass-morphism**: Translucent backgrounds with backdrop blur
- **Gradient Overlays**: Smooth color transitions
- **Smooth Animations**: CSS transitions and transforms
- **Shadow System**: Layered shadows for depth
- **Hover Effects**: Interactive element responses

## 🚀 Performance Optimizations

- **Client-Side Filtering**: Reduced server requests
- **Image Optimization**: Proper sizing and lazy loading
- **Code Splitting**: Optimized bundle sizes
- **Caching Strategy**: Efficient data caching
- **Database Indexing**: Optimized query performance

## 🙏 Acknowledgments

- **Material-UI (MUI)**: Modern React component library
- **Spring Boot**: Powerful Java framework
- **Spring Security**: Comprehensive security framework
- **PostgreSQL**: Robust relational database
- **React.js**: Modern frontend framework
- **JWT**: Secure authentication standard
- **CSS3**: Advanced styling capabilities
- **Axios**: Reliable HTTP client