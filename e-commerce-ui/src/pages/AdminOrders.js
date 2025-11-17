import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Chip,
  TablePagination,
  Card,
  CardContent
} from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import api from '../config/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/admin/orders?page=${page}&size=${rowsPerPage}`);
      setOrders(response.data.content);
      setTotalOrders(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'primary';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingBag sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Order Management
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Manage and track all customer orders
        </Typography>
      </Box>

      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)'
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Customer Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Total Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Order Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order.id} sx={{ 
                    '&:hover': { 
                      bgcolor: '#f7fafc',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease'
                    },
                    borderBottom: index === orders.length - 1 ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      color: '#2d3748',
                      fontSize: '0.9rem'
                    }}>#{order.id}</TableCell>
                    <TableCell sx={{ color: '#4a5568', fontWeight: 'medium' }}>{order.fullName}</TableCell>
                    <TableCell sx={{ color: '#718096' }}>{order.email}</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      color: '#38a169',
                      fontSize: '1rem'
                    }}>${order.totalAmount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          borderRadius: 2,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#718096' }}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#cbd5e0'
                            }
                          }}
                        >
                          <MenuItem value="PENDING">PENDING</MenuItem>
                          <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalOrders}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              borderTop: '1px solid #e2e8f0',
              bgcolor: '#f7fafc'
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminOrders;