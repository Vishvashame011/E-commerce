import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Menu, MenuItem, Button } from '@mui/material';
import { ShoppingCart, Notifications, AccountCircle, Store, Add, Login, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      fetchCartCount();
    }
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItemCount(0);
        return;
      }
      
      const response = await axios.get(API_ENDPOINTS.CART.COUNT, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItemCount(response.data.cartItemCount || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemCount(0);
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleProfileClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCartItemCount(0);
    handleProfileClose();
    window.location.reload();
  };

  // Expose cart refresh function globally
  window.refreshCartCount = fetchCartCount;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.05)',
          zIndex: -1
        }
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }} 
          onClick={() => navigate('/')}
        >
          <Store sx={{ 
            mr: 1, 
            fontSize: 32,
            color: '#fff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} />
          <Typography 
            variant="h5" 
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
          >
            E-Commerce Store
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Button
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/admin/dashboard')}
                  sx={{ 
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Admin Panel
                </Button>
              )}
              {user?.role === 'ADMIN' && (
                <Button
                  startIcon={<Add />}
                  onClick={() => navigate('/add-product')}
                  sx={{ 
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Add Product
                </Button>
              )}
              <Button
                onClick={() => navigate('/orders')}
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                My Orders
              </Button>
              <Button
                onClick={() => navigate('/wishlist')}
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Wishlist
              </Button>
              <IconButton 
                aria-label="shopping cart" 
                onClick={() => navigate('/cart')}
                sx={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Badge 
                  badgeContent={cartItemCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton 
                aria-label="notifications"
                sx={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Notifications />
              </IconButton>
              <IconButton 
                aria-label="profile" 
                onClick={handleProfileClick}
                sx={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    mt: 1,
                    minWidth: 200
                  }
                }}
              >
                <MenuItem 
                  onClick={() => handleMenuItemClick('/profile')}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={() => handleMenuItemClick('/orders')}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  My Orders
                </MenuItem>
                <MenuItem 
                  onClick={() => handleMenuItemClick('/wishlist')}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Wishlist
                </MenuItem>
                {user?.role === 'ADMIN' && (
                  <MenuItem 
                    onClick={() => handleMenuItemClick('/admin/dashboard')}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    fontWeight: 'bold',
                    color: '#ef4444',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                sx={{ 
                  color: 'white',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e879f9 0%, #ef4444 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;