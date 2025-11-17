import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingBag, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../config/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [navigate]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.WISHLIST.GET, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWishlistItems(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(ERROR_MESSAGES.SERVER_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Favorite sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            My Wishlist ({wishlistItems.length})
          </Typography>
        </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {wishlistItems.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Box sx={{ 
            bgcolor: 'white',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Favorite sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 2 }}>
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Save items you love to your wishlist and shop them later
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                px: 4
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ProductCard product={item.product} />
            </Grid>
          ))}
        </Grid>
      )}
      </Container>
    </Box>
  );
};

export default Wishlist;