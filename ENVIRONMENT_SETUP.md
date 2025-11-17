# Environment Setup Guide

## Backend Environment Variables

Create a `.env` file in the `e-commerce-backend` directory with the following variables:

```bash
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/ecommerce
DB_USERNAME=postgres
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_256_bits_long
JWT_EXPIRATION=86400000

# Email Configuration (Gmail SMTP)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Server Configuration
SERVER_PORT=8081
CORS_ORIGINS=http://localhost:3000
```

## Setting up Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords" section
4. Generate a new app password for "Mail"
5. Use this password in `MAIL_PASSWORD`

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:8081/login/oauth2/code/google`
   - `http://localhost:3000/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords and secrets
- Rotate credentials regularly
- Use environment-specific configurations for production