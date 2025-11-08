import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip,
  Divider, Grid, Button, CircularProgress
} from '@mui/material';
import { ShoppingBag, LocalShipping, CheckCircle } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();
  const localOrders = useSelector(state => state.orders.orders);
  const [backendOrders, setBackendOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackendOrders();
  }, []);

  const fetchBackendOrders = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ORDERS);
      setBackendOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Combine local and backend orders
  const allOrders = [...localOrders, ...backendOrders];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <LocalShipping />;
      case 'Delivered': return <CheckCircle />;
      default: return <ShoppingBag />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (allOrders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h5" gutterBottom>No orders yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start shopping to see your orders here!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders ({allOrders.length})
      </Typography>

      <Grid container spacing={3}>
        {allOrders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id || Date.now()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {formatDate(order.orderDate || order.order_date)}
                    </Typography>
                    {(order.deliveryDate || order.delivery_date) && (
                      <Typography variant="body2" color="text.secondary">
                        Delivered on {formatDate(order.deliveryDate || order.delivery_date)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Chip
                    icon={getStatusIcon(order.status)}
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Items ({(order.items || order.orderItems || []).length}):
                    </Typography>
                    {(order.items || order.orderItems || []).map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {item.title || item.product?.title || 'Product'} x {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                    
                    {(order.discount || order.discountAmount) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Discount ({order.promoCode || order.promo_code}):
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -${(order.discount || order.discountAmount || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        ${(order.total || order.totalAmount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Delivery Address:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(order.address?.fullName || order.fullName || order.full_name)}<br />
                      {(order.address?.street || order.street)}<br />
                      {(order.address?.city || order.city)}, {(order.address?.state || order.state)} {(order.address?.zipCode || order.zipCode || order.zip_code)}<br />
                      {(order.address?.country || order.country)}<br />
                      Phone: {(order.address?.phone || order.phone)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small">
                    Track Order
                  </Button>
                  {order.status === 'Delivered' && (
                    <Button variant="outlined" size="small">
                      Reorder
                    </Button>
                  )}
                  <Button variant="outlined" size="small" color="error">
                    Cancel Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;