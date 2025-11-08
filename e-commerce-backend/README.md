# E-Commerce Backend API

Spring Boot backend for the E-Commerce application with SQLite database.

## Features

- **Product Management**: CRUD operations for products
- **Promo Code Validation**: Validate discount codes with expiry dates
- **Order Processing**: Create and manage orders with checkout details
- **Auto-Delivery**: Automatically mark orders as delivered after 6 hours
- **Data Seeding**: Initial sample data for products and promo codes

## Tech Stack

- Spring Boot 3.2.0
- Spring Data JPA
- SQLite Database
- Maven
- Java 17

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Promo Codes
- `GET /api/promo-codes/validate/{code}` - Validate promo code

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order

## Running the Application

1. Make sure you have Java 17 installed
2. Navigate to the backend directory:
   ```bash
   cd e-commerce-backend
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

The application will start on `http://localhost:8080`

## Database

The application uses PostgreSQL database.

### Setup PostgreSQL:
1. Install PostgreSQL: `sudo apt install postgresql postgresql-contrib`
2. Start PostgreSQL: `sudo systemctl start postgresql`
3. Set postgres user password: `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'root';"`
4. Run setup script: `./setup-database.sh`

### Database Details:
- **Database:** ecommerce
- **Host:** localhost:5432
- **Username:** postgres
- **Password:** root

## Sample Data

The application automatically seeds sample data on startup:
- 8 sample products across different categories
- 3 promo codes: SAVE10 (10%), SAVE20 (20%), WELCOME15 (15%)

## CORS Configuration

CORS is configured to allow requests from `http://localhost:3000` (React frontend).