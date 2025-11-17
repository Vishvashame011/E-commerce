-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';
    END IF;
END $$;

-- Update existing users to have USER role if role is null
UPDATE users SET role = 'USER' WHERE role IS NULL;