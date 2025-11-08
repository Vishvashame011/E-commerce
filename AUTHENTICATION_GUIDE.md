# E-Commerce Authentication & Authorization System

## Overview
This project now includes a complete authentication and authorization system with user profiles and secure order management.

## Features Implemented

### 1. Authentication System
- **JWT-based authentication** with secure token generation
- **User registration** with validation
- **User login** with credential verification
- **Password encryption** using BCrypt
- **Token-based session management**

### 2. User Profile Management
- **Complete user profile** with personal information
- **Profile image upload** functionality
- **Editable profile fields**: name, email, phone, address, etc.
- **Profile photo management** with file upload

### 3. Secure Order Management
- **User-specific orders** - users can only see their own orders
- **Authenticated order creation** - requires login to place orders
- **Order history** with user association
- **Order tracking** with status updates

### 4. Database Schema Updates
- **User table** enhanced with profile fields
- **Order table** linked to users via foreign key
- **OrderItem table** maintains product relationships

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup     - User registration
POST /api/auth/login      - User login
```

### Profile Management Endpoints (Authenticated)
```
GET    /api/users/profile        - Get current user profile
PUT    /api/users/profile        - Update current user profile
POST   /api/users/profile/image  - Upload profile image
```

### Order Management Endpoints (Authenticated)
```
POST   /api/orders               - Create new order (authenticated)
GET    /api/orders/my-orders     - Get current user's orders
```

### Legacy Endpoints (Admin/Testing)
```
GET    /api/orders               - Get all orders (admin)
GET    /api/users/{id}           - Get user by ID
PUT    /api/users/{id}           - Update user by ID
```

## Frontend Pages

### New Pages Added
1. **Login Page** (`/login`) - User authentication
2. **Signup Page** (`/signup`) - User registration  
3. **Profile Page** (`/profile`) - User profile management

### Updated Pages
1. **Header Component** - Shows login/logout based on auth status
2. **Checkout Page** - Requires authentication to place orders
3. **Orders Page** - Shows only user's own orders

## Security Features

### JWT Token Security
- Tokens expire after 24 hours (configurable)
- Secure token validation on protected endpoints
- Automatic token refresh handling

### Password Security
- BCrypt encryption with salt
- Minimum password length validation
- Secure password storage

### Authorization
- Role-based access control ready for implementation
- User-specific data access
- Protected endpoints require valid JWT tokens

## Database Schema

### User Table Fields
```sql
- id (Primary Key)
- username (Unique)
- email (Unique) 
- password (Encrypted)
- first_name
- last_name
- phone_number
- profile_image
- date_of_birth
- address
- city
- state
- zip_code
- country
- created_at
- updated_at
```

### Order Table Updates
```sql
- user_id (Foreign Key to User)
- All existing order fields maintained
```

## Usage Instructions

### For Users
1. **Register**: Visit `/signup` to create an account
2. **Login**: Visit `/login` to authenticate
3. **Profile**: Visit `/profile` to manage personal information
4. **Shopping**: Browse products and add to cart
5. **Checkout**: Complete purchase (requires login)
6. **Orders**: View order history at `/orders`

### For Developers
1. **Authentication**: Include `Authorization: Bearer <token>` header
2. **Token Storage**: Store JWT token in localStorage
3. **Error Handling**: Handle 401 responses for expired tokens
4. **Profile Updates**: Use ProfileRequest DTO for updates

## Configuration

### Backend Configuration
```properties
# JWT Configuration
app.jwtSecret=mySecretKey
app.jwtExpirationMs=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend Configuration
- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Redirect to login on authentication failure

## Security Best Practices Implemented

1. **Password Encryption**: BCrypt with salt
2. **JWT Security**: Signed tokens with expiration
3. **Input Validation**: Server-side validation for all inputs
4. **CORS Configuration**: Proper cross-origin setup
5. **Error Handling**: Secure error messages
6. **File Upload Security**: Type and size validation

## Testing the System

### Manual Testing Steps
1. Start the backend server
2. Start the frontend application
3. Register a new user account
4. Login with credentials
5. Update profile information
6. Upload profile image
7. Add products to cart
8. Complete checkout process
9. View order history

### API Testing with curl
```bash
# Register user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get profile (with token)
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Future Enhancements

1. **Role-based Access Control** - Admin, Customer, Vendor roles
2. **Email Verification** - Verify email addresses during registration
3. **Password Reset** - Forgot password functionality
4. **Social Login** - Google, Facebook authentication
5. **Two-Factor Authentication** - Enhanced security
6. **Account Management** - Deactivate/delete accounts
7. **Audit Logging** - Track user activities
8. **Rate Limiting** - Prevent abuse of authentication endpoints

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check if JWT token is valid and not expired
2. **403 Forbidden**: Verify user has required permissions
3. **Profile Image Upload**: Ensure file size is under 10MB
4. **CORS Errors**: Check frontend URL in CORS configuration

### Debug Tips
1. Check browser console for authentication errors
2. Verify JWT token format and expiration
3. Check network tab for API request/response details
4. Review backend logs for detailed error messages