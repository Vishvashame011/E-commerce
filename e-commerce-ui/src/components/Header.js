import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Menu, MenuItem, Button } from '@mui/material';
import { ShoppingCart, Notifications, AccountCircle, Store, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const cartItemCount = useSelector(state => state.cart.itemCount);
  const [anchorEl, setAnchorEl] = useState(null);

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
            <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;