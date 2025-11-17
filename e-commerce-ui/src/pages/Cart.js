import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, CardMedia, 
  IconButton, Button, TextField, Divider, Grid, Chip, CircularProgress
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, UPLOAD_BASE_URL, ERROR_MESSAGES } from '../config/api';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
    // Load saved promo code
    const savedPromo = localStorage.getItem('appliedPromoCode');
    const savedDiscount = localStorage.getItem('promoDiscount');
    if (savedPromo) {
      setPromoCode(savedPromo);
      setPromoInput(savedPromo);
      setDiscount(parseFloat(savedDiscount) || 0);
    }
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.CART.GET, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.CART.UPDATE, null, {
        params: { productId, quantity: newQuantity },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCart(); // Refresh cart
      window.dispatchEvent(new Event('cartUpdated')); // Update header count
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.CART.REMOVE(productId), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCart(); // Refresh cart
      window.dispatchEvent(new Event('cartUpdated')); // Update header count
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleApplyPromo = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.VALIDATE_PROMO(promoInput));
      console.log('Promo validation response:', response.data);
      if (response.data.valid) {
        const discountPercentage = response.data.discountPercentage || 0;
        const discountAmount = (subtotal * discountPercentage) / 100;
        setPromoCode(promoInput);
        setDiscount(discountAmount);
        // Store promo code in localStorage for checkout page
        localStorage.setItem('appliedPromoCode', promoInput);
        localStorage.setItem('promoDiscount', discountAmount.toString());
        console.log('Applied promo:', promoInput, 'Percentage:', discountPercentage, 'Amount:', discountAmount);
      } else {
        alert(response.data.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      alert('Error validating promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount); // Ensure total is never negative
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box sx={{ 
            bgcolor: 'white',
            borderRadius: 3,
            p: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <ShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 2 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Add some products to get started!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ShoppingCart sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Shopping Cart ({itemCount} items)
          </Typography>
        </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} sx={{ 
              mb: 2,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'contain' }}
                    image={item.product.image?.startsWith('/uploads/') ? `${UPLOAD_BASE_URL}${item.product.image}` : item.product.image}
                    alt={item.product.title}
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.product.title}
                    </Typography>
                    <Chip label={item.product.category} size="small" sx={{ mb: 1 }} />
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${item.product.price}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body1" sx={{ ml: 'auto', mr: 2 }}>
                        Total: ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                      
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            position: 'sticky', 
            top: 20,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Promo Code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={handleApplyPromo}
                  disabled={!promoInput}
                >
                  Apply Code
                </Button>
                {promoCode && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Promo code "{promoCode}" applied!
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try: SAVE10 or SAVE20
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                {discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="success.main">Discount:</Typography>
                    <Typography color="success.main">-${discount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                  textTransform: 'none'
                }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
};

export default Cart;