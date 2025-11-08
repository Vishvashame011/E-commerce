import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="product-card" onClick={handleClick}>
      <CardMedia
        component="img"
        className="product-image"
        image={product.image}
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
      </CardContent>
    </Card>
  );
};

export default ProductCard;