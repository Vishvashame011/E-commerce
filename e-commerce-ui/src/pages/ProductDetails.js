import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Rating, Box, Chip, CircularProgress, IconButton, Snackbar, Alert, Grid, Divider } from '@mui/material';
import { ArrowBack, ShoppingCart, Favorite } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS } from '../config/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      setProduct(response.data);
      
      // Fetch related products from same category
      if (response.data.category) {
        fetchRelatedProducts(response.data.category, response.data.id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      // Use dedicated related products API
      const response = await axios.get(API_ENDPOINTS.RELATED_PRODUCTS(currentProductId, 5));
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Fallback to category-based filtering
      try {
        const fallbackResponse = await axios.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
        const filtered = fallbackResponse.data
          .filter(p => p.id !== currentProductId)
          .sort(() => Math.random() - 0.5) // Shuffle array
          .slice(0, 5);
        setRelatedProducts(filtered);
      } catch (fallbackError) {
        console.error('Error fetching fallback related products:', fallbackError);
      }
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
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Related Products
            </Typography>
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={2.4} key={relatedProduct.id}>
                  <ProductCard product={relatedProduct} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
      
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