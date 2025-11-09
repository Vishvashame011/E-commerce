import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box, Button, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS, UPLOAD_BASE_URL } from '../config/api';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState({ averageRating: 0, totalRatings: 0 });

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
    <Card className="product-card" onClick={handleClick}>
      <CardMedia
        component="img"
        className="product-image"
        image={product.image?.startsWith('/uploads/') ? `${UPLOAD_BASE_URL}${product.image}` : product.image}
        alt={product.title}
      />
      <CardContent className="product-info">
        <div className="product-category">
          {product.category}
        </div>
        <Typography className="product-title" gutterBottom>
          {product.title}
        </Typography>
        <Typography className="product-price">
          ${product.price}
        </Typography>
        <Box className="rating-container">
          <Rating value={rating.averageRating || 0} readOnly size="small" precision={0.1} />
          <Typography variant="body2" color="text.secondary">
            ({rating.totalRatings || 0})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{ fontSize: '0.75rem' }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;