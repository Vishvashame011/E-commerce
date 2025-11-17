import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import { People, Inventory, ShoppingCart, TrendingUp } from '@mui/icons-material';
import api from '../config/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardData.totalUsers}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Users</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                  <People sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardData.totalProducts}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Products</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                  <Inventory sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dashboardData.totalOrders}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Orders</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                  <ShoppingCart sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUp sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
              Recent Orders
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ 
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid #e2e8f0'
          }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f7fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentOrders.map((order, index) => (
                  <TableRow key={order.id} sx={{ 
                    '&:hover': { bgcolor: '#f7fafc' },
                    borderBottom: index === dashboardData.recentOrders.length - 1 ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <TableCell sx={{ fontWeight: 'medium', color: '#2d3748' }}>#{order.id}</TableCell>
                    <TableCell sx={{ color: '#4a5568' }}>{order.fullName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#38a169' }}>${order.totalAmount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#718096' }}>
                      {order.orderDate ? (() => {
                        const date = new Date(order.orderDate);
                        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                      })() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;