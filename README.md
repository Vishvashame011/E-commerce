# E-Commerce Project

A full-stack e-commerce application built with React.js frontend and Spring Boot backend.

## 🚀 Features

### Frontend (React.js)
- **Product Catalog**: Browse products by categories
- **Product Details**: Detailed product pages with images
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login/Signup functionality
- **User Profile**: Profile management with image upload
- **Wishlist**: Save favorite products
- **Reviews & Ratings**: Customer reviews with star ratings
- **Promo Codes**: Discount code system
- **Checkout Process**: Multi-step checkout with address
- **Order History**: View past orders
- **Responsive Design**: Mobile-friendly UI

### Backend (Spring Boot)
- **REST API**: Complete RESTful API
- **JWT Authentication**: Secure user authentication
- **Database Integration**: PostgreSQL database
- **File Upload**: Image upload for products and profiles
- **Security**: Password encryption, CORS configuration
- **Validation**: Input validation and error handling
- **Pagination**: Efficient data loading

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Material-UI (MUI)
- Redux Toolkit
- Axios
- React Router

### Backend
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT
- Maven

## 📁 Project Structure

```
E-Commerce-Project/
├── e-commerce-backend/          # Spring Boot backend
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # Configuration files
│   ├── uploads/                # Uploaded images
│   └── pom.xml                 # Maven dependencies
├── e-commerce-ui/              # React frontend
│   ├── src/                    # React source code
│   ├── public/                 # Static files
│   └── package.json            # NPM dependencies
├── setup-database.sh           # Database setup script
├── setup-postgres.sql          # Database schema
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

## 🎯 Key Features Implemented

1. **Complete Authentication System**
2. **Product Management with Categories**
3. **Shopping Cart with Persistence**
4. **User Profile Management**
5. **Wishlist Functionality**
6. **Review & Rating System**
7. **Promo Code System**
8. **Order Management**
9. **File Upload System**
10. **Responsive UI Design**

## 🔒 Security Features

- JWT-based authentication
- Password encryption
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

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

## 🙏 Acknowledgments

- Material-UI for the component library
- Spring Boot for the backend framework
- PostgreSQL for the database
- React.js for the frontend framework