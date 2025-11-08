import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Rating, Box, Chip, CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import { ArrowBack, ShoppingCart, Favorite } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setShowSnackbar(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
          <ArrowBack />
        </IconButton>
      </Box>

      <div className="product-details-container">
        <div className="product-details-grid">
          <Box>
            <img
              src={product.image?.startsWith('/uploads/') ? `http://localhost:8081${product.image}` : product.image}
              alt={product.title}
              className="product-details-image"
            />
          </Box>

          <Box>
            <Chip 
              label={product.category} 
              color="primary" 
              variant="outlined" 
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            <Box className="rating-container">
              <Rating value={product.rating?.rate || 0} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.rating?.count || 0} reviews)
              </Typography>
            </Box>

            <Typography variant="h3" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Favorite />}
              >
                Wishlist
              </Button>
            </Box>
          </Box>
        </div>
      </div>
      
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success">
          Product added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;