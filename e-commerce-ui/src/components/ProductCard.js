import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box, Button, IconButton, Chip, CardActions } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS, UPLOAD_BASE_URL } from '../config/api';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState({ averageRating: 0, totalRatings: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product?.id) {
      fetchRating();
    }
  }, [product?.id]);

  const fetchRating = async () => {
    if (!product?.id) return;
    
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_RATING(product.id));
      setRating(response.data);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.CART.ADD, null, {
        params: { productId: product.id, quantity: 1 },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Card sx={{
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
      }
    }}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          sx={{
            height: 220,
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
          image={product.image?.startsWith('/uploads/') ? `${UPLOAD_BASE_URL}${product.image}` : product.image}
          alt={product.title}
          onClick={handleClick}
        />
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
          size="small"
        >
          <FavoriteBorder sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      
      <CardContent sx={{ p: 2 }} onClick={handleClick}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: '#2d3748',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {product.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={rating.averageRating || 0} readOnly size="small" precision={0.1} />
          <Typography variant="caption" sx={{ ml: 1, color: '#718096' }}>
            ({rating.totalRatings || 0})
          </Typography>
        </Box>
        
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: '#38a169',
            mb: 2
          }}
        >
          ${product.price}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          sx={{
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
            }
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;