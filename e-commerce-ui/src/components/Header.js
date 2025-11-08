import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { ShoppingCart, Notifications, AccountCircle, Store } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

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
          <IconButton color="inherit" aria-label="shopping cart">
            <ShoppingCart />
          </IconButton>
          <IconButton color="inherit" aria-label="notifications">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" aria-label="profile">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;