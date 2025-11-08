import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box, Button, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <Card className="product-card" onClick={handleClick}>
      <CardMedia
        component="img"
        className="product-image"
        image={product.image?.startsWith('/uploads/') ? `http://localhost:8081${product.image}` : product.image}
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
          <Rating value={product.rating?.rate || 0} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({product.rating?.count || 0})
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