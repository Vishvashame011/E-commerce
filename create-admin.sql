-- Create admin user manually
-- Password hash for 'Vishvash123' using BCrypt
INSERT INTO users (username, email, password, first_name, last_name, phone_number, role, mobile_verified, email_verified, created_at, updated_at)
VALUES ('vishvashame011', 'vishvashame011@gmail.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Vishvash', 'Ame', '7869835983', 'ADMIN', true, true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- If user already exists, update password
UPDATE users SET password = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW' WHERE username = 'vishvashame011';

-- Alternative: Update existing user to admin
-- UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';