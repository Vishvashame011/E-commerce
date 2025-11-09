import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Menu, MenuItem, Button } from '@mui/material';
import { ShoppingCart, Notifications, AccountCircle, Store, Add, Login } from '@mui/icons-material';
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
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Store sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            E-Commerce Store
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                startIcon={<Add />}
                onClick={() => navigate('/add-product')}
                sx={{ mr: 1 }}
              >
                Add Product
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/orders')}
                sx={{ mr: 1 }}
              >
                My Orders
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/wishlist')}
                sx={{ mr: 1 }}
              >
                Wishlist
              </Button>
              <IconButton color="inherit" aria-label="shopping cart" onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton color="inherit" aria-label="notifications">
                <Notifications />
              </IconButton>
              <IconButton color="inherit" aria-label="profile" onClick={handleProfileClick}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
              >
                <MenuItem onClick={() => handleMenuItemClick('/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/orders')}>My Orders</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/wishlist')}>Wishlist</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate('/signup')}
                sx={{ mr: 1, borderColor: 'white', '&:hover': { borderColor: 'white' } }}
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