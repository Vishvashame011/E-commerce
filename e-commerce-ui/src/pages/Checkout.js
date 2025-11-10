import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Grid, Divider, Alert, Stepper, Step, StepLabel, CircularProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { API_ENDPOINTS, UPLOAD_BASE_URL } from '../config/api';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const steps = ['Delivery Address', 'Review Order', 'Payment'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.CART.GET, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems(response.data);
      
      // Load saved promo code
      const savedPromo = localStorage.getItem('appliedPromoCode');
      const savedDiscount = localStorage.getItem('promoDiscount');
      if (savedPromo) {
        setPromoCode(savedPromo);
        setDiscount(parseFloat(savedDiscount) || 0);
      }
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal - discount;

  const handleInputChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return Object.values(address).every(value => value.trim() !== '');
  };

  const handleNext = () => {
    if (activeStep === 0 && !isAddressValid()) {
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      const orderData = {
        totalAmount: total,
        discountAmount: discount,
        promoCode: promoCode,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country
      };
      
      // Send to backend with authentication
      await axios.post(API_ENDPOINTS.ORDERS, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Clear cart from backend
      await axios.delete(API_ENDPOINTS.CART.CLEAR, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Clear promo code data
      localStorage.removeItem('appliedPromoCode');
      localStorage.removeItem('promoDiscount');
      
      // Update local state
      dispatch(placeOrder(orderData));
      dispatch(clearCart());
      setOrderPlaced(true);
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response?.status === 401) {
        alert('Please login to place an order');
        navigate('/login');
      } else {
        alert('Failed to place order. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  if (orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>Order Placed Successfully!</Typography>
          <Typography>Thank you for your purchase. You will be redirected to your orders page.</Typography>
        </Alert>
      </Container>
    );
  }

  const renderAddressForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Delivery Address</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={address.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={address.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={address.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Street Address"
              value={address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={address.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={address.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              value={address.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderOrderReview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Order Review</Typography>
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Delivery Address:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.fullName}<br />
          {address.street}<br />
          {address.city}, {address.state} {address.zipCode}<br />
          {address.country}<br />
          Phone: {address.phone}<br />
          Email: {address.email}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Order Items:
        </Typography>
        {cartItems.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              {item.product.title} x {item.quantity}
            </Typography>
            <Typography variant="body2">
              ${(item.product.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>
        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">Discount ({promoCode}):</Typography>
            <Typography color="success.main">-${discount.toFixed(2)}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPayment = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Payment Information</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          This is a demo checkout. No actual payment will be processed.
        </Alert>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              placeholder="MM/YY"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              placeholder="123"
              disabled
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>
        {activeStep === 0 && renderAddressForm()}
        {activeStep === 1 && renderOrderReview()}
        {activeStep === 2 && renderPayment()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !isAddressValid()}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Checkout;