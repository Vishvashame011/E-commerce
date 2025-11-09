import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Rating, Box, Chip, CircularProgress, IconButton, Snackbar, Alert, Grid, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBack, ShoppingCart, Favorite, Star } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS, UPLOAD_BASE_URL, ERROR_MESSAGES } from '../config/api';
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
  const [productRating, setProductRating] = useState({ averageRating: 0, totalRatings: 0 });
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = !!token;
    setIsAuthenticated(authenticated);
    
    // If not authenticated, immediately set wishlist state
    if (!authenticated) {
      setInWishlist(false);
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && id) {
      checkWishlistStatus();
    } else if (!isAuthenticated) {
      setInWishlist(false);
      setWishlistLoading(false);
    }
  }, [isAuthenticated, id]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      setProduct(response.data);
      
      // Fetch product rating
      fetchProductRating();
      
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

  const fetchProductRating = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_RATING(id));
      setProductRating(response.data);
    } catch (error) {
      console.error('Error fetching product rating:', error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!isAuthenticated) {
      setInWishlist(false);
      setWishlistLoading(false);
      return;
    }
    
    setWishlistLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setInWishlist(false);
        setWishlistLoading(false);
        return;
      }
      
      const response = await axios.get(API_ENDPOINTS.WISHLIST.CHECK(id), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInWishlist(response.data.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setInWishlist(false);
    } finally {
      setWishlistLoading(false);
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

  const handleAddToCart = async () => {
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
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
      alert('Please login to rate this product');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.PRODUCT_RATING(id), {
        rating: userRating,
        review: userReview
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setShowRatingDialog(false);
      setUserRating(0);
      setUserReview('');
      fetchProductRating(); // Refresh rating
      setShowSnackbar(true);
    } catch (error) {
      alert(error.response?.data?.error || ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.WISHLIST.TOGGLE(id), {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setInWishlist(response.data.inWishlist);
      // Also refresh the wishlist status to ensure consistency
      setTimeout(() => {
        checkWishlistStatus();
      }, 100);
      setShowSnackbar(true);
    } catch (error) {
      alert(error.response?.data?.error || ERROR_MESSAGES.SERVER_ERROR);
    }
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
              src={product.image?.startsWith('/uploads/') ? `${UPLOAD_BASE_URL}${product.image}` : product.image}
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
              <Rating value={productRating.averageRating || 0} readOnly precision={0.1} />
              <Typography variant="body2" color="text.secondary">
                ({productRating.totalRatings || 0} reviews)
              </Typography>
              {isAuthenticated && (
                <Button
                  size="small"
                  startIcon={<Star />}
                  onClick={() => setShowRatingDialog(true)}
                  sx={{ ml: 2 }}
                >
                  Rate Product
                </Button>
              )}
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
                variant={inWishlist ? "contained" : "outlined"}
                size="large"
                startIcon={wishlistLoading ? <CircularProgress size={20} /> : <Favorite />}
                onClick={handleWishlistToggle}
                color={inWishlist ? "secondary" : "primary"}
                disabled={wishlistLoading || !isAuthenticated}
              >
                {wishlistLoading ? 'Loading...' : 
                 !isAuthenticated ? 'Login to Add' :
                 inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
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
          {userRating > 0 ? 'Rating submitted successfully!' : 
           showSnackbar && inWishlist ? 'Added to wishlist!' : 
           showSnackbar && !inWishlist ? 'Removed from wishlist!' : 'Product added to cart!'}
        </Alert>
      </Snackbar>

      <Dialog open={showRatingDialog} onClose={() => setShowRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate this Product</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography gutterBottom>Your Rating:</Typography>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review (Optional)"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitRating} variant="contained" disabled={userRating === 0}>
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;