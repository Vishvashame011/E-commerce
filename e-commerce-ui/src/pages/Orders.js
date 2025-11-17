import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip,
  Divider, Grid, Button, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { ShoppingBag, LocalShipping, CheckCircle, Refresh, AccessTime, Cancel, Receipt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../config/api';
import OrderStatusTracker from '../components/OrderStatusTracker';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();
  const [backendOrders, setBackendOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackendOrders();
    // Auto-refresh every 30 seconds to check status updates
    const interval = setInterval(fetchBackendOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackendOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_ENDPOINTS.ORDERS}/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBackendOrders(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching orders:', error.message);
      }
      setLoading(false);
    }
  };

  // Use only backend orders (database is source of truth)
  const allOrders = backendOrders;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <AccessTime />;
      case 'DELIVERED': return <CheckCircle />;
      case 'CANCELLED': return <Cancel />;
      default: return <LocalShipping />;
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh orders after cancellation
      fetchBackendOrders();
    } catch (error) {
      const errorMsg = error.response?.data?.error || ERROR_MESSAGES.SERVER_ERROR;
      alert('Failed to cancel order: ' + errorMsg);
    }
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
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box sx={{ 
            bgcolor: 'white',
            borderRadius: 3,
            p: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <ShoppingBag sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 2 }}>
              No orders found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {loading ? 'Loading orders...' : 'You haven\'t placed any orders yet'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
                Start Shopping
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={fetchBackendOrders}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                  textTransform: 'none'
                }}
              >
                Retry Loading
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Receipt sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c', mr: 'auto' }}>
            My Orders ({allOrders.length})
          </Typography>
          <Tooltip title="Refresh Orders">
            <IconButton 
              onClick={fetchBackendOrders} 
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

      <Grid container spacing={3}>
        {allOrders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3 }}>
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status || 'PENDING'}
                      color={getStatusColor(order.status)}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    {order.status?.toUpperCase() === 'PENDING' && (
                      <Typography variant="caption" color="text.secondary">
                        Auto-delivery in 6 hours
                      </Typography>
                    )}
                    {order.status?.toUpperCase() === 'CANCELLED' && (
                      <Typography variant="caption" color="error">
                        Order cancelled
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Items ({(order.items || order.orderItems || []).reduce((total, item) => total + (item.quantity || 0), 0)} items, {(order.items || order.orderItems || []).length} products):
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

                <OrderStatusTracker order={order} />

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(order.status?.toUpperCase() !== 'CANCELLED') && (
                    <Button variant="outlined" size="small">
                      Track Order
                    </Button>
                  )}
                  {(order.status?.toUpperCase() === 'DELIVERED') && (
                    <Button variant="outlined" size="small" color="success">
                      Reorder
                    </Button>
                  )}
                  {(order.status?.toUpperCase() === 'PENDING') && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="error"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {(order.status?.toUpperCase() === 'CANCELLED') && (
                    <Button variant="outlined" size="small" color="success">
                      Reorder
                    </Button>
                  )}
                  <Button variant="outlined" size="small" onClick={fetchBackendOrders}>
                    Refresh Status
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>
  );
};

export default Orders;