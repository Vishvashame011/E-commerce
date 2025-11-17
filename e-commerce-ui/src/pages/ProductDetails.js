import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Rating, Box, Chip, CircularProgress, IconButton, Snackbar, Alert, Grid, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ArrowBack, ShoppingCart, Favorite, Star, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS, UPLOAD_BASE_URL, ERROR_MESSAGES } from '../config/api';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
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
  const [currentSlide, setCurrentSlide] = useState(0);

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
      const response = await axios.get(API_ENDPOINTS.RELATED_PRODUCTS(currentProductId, 10));
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Fallback to category-based filtering
      try {
        const fallbackResponse = await axios.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
        const filtered = fallbackResponse.data
          .filter(p => p.id !== currentProductId)
          .sort(() => Math.random() - 0.5) // Shuffle array
          .slice(0, 10);
        setRelatedProducts(filtered);
      } catch (fallbackError) {
        console.error('Error fetching fallback related products:', fallbackError);
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev >= relatedProducts.length - 5 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev <= 0 ? Math.max(0, relatedProducts.length - 5) : prev - 1
    );
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
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ 
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f7fafc' }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 4
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 4,
            '@media (max-width: 768px)': {
              flexDirection: 'column'
            }
          }}>
            {/* Image Section - Always Left */}
            <Box sx={{
              flex: '0 0 50%',
              '@media (max-width: 768px)': {
                flex: '1 1 auto'
              }
            }}>
              <Box sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white'
              }}>
                <img
                  src={product.image?.startsWith('/uploads/') ? `${UPLOAD_BASE_URL}${product.image}` : product.image}
                  alt={product.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Box>

            {/* Content Section - Always Right */}
            <Box sx={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '400px'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                minHeight: '400px'
              }}>
                <Box sx={{ flex: 1 }}>
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

                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, mb: 4 }}>
                    {product.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    }
                  }}
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
                  sx={{
                    borderRadius: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    ...(inWishlist && {
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e879f9 0%, #ef4444 100%)'
                      }
                    })
                  }}
                >
                  {wishlistLoading ? 'Loading...' : 
                   !isAuthenticated ? 'Login to Add' :
                   inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ 
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 4
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 3 }}>
              Related Products
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
              {/* Navigation Buttons */}
              {relatedProducts.length > 5 && (
                <>
                  <IconButton
                    onClick={prevSlide}
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      bgcolor: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': { bgcolor: '#f7fafc' }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={nextSlide}
                    sx={{
                      position: 'absolute',
                      right: -20,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      bgcolor: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': { bgcolor: '#f7fafc' }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
              
              {/* Products Carousel Container */}
              <Box sx={{ overflow: 'hidden', mx: 2 }}>
                <Box sx={{
                  display: 'flex',
                  transform: `translateX(-${currentSlide * (100/5)}%)`,
                  transition: 'transform 0.3s ease-in-out',
                  gap: 2
                }}>
                  {relatedProducts.map((relatedProduct) => (
                    <Box
                      key={relatedProduct.id}
                      sx={{
                        minWidth: 'calc(20% - 8px)',
                        maxWidth: 'calc(20% - 8px)',
                        flexShrink: 0
                      }}
                    >
                      <ProductCard product={relatedProduct} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      
      {/* Reviews Section */}
      <Divider sx={{ my: 4 }} />
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <ProductReviews productId={id} />
      </Box>
      
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
    </Box>
  );
};

export default ProductDetails;