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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
  Fab,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { Delete, Edit, Add, Inventory, Image } from '@mui/icons-material';
import api from '../config/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/admin/products?page=${page}&size=${rowsPerPage}`);
      setProducts(response.data.content);
      setTotalProducts(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image
    });
    setOpenDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productForm);
      } else {
        await api.post('/admin/products', productForm);
      }
      setOpenDialog(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
          <Inventory sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Product Management
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Manage your product catalog and inventory
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
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Details</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} sx={{ 
                    '&:hover': { 
                      bgcolor: '#f7fafc',
                      transform: 'scale(1.01)',
                      transition: 'all 0.2s ease'
                    },
                    borderBottom: index === products.length - 1 ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={product.image} 
                          alt={product.title}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            mr: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Image />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
                            {product.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#718096' }}>
                            ID: {product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#4a5568', maxWidth: 200 }}>
                        {product.description ? 
                          (product.description.length > 50 ? 
                            product.description.substring(0, 50) + '...' : 
                            product.description
                          ) : 'No description'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#38a169' }}>
                        ${product.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category}
                        color="primary"
                        size="small"
                        sx={{ 
                          fontWeight: 'medium',
                          borderRadius: 2,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<Edit />}
                          onClick={() => handleEditProduct(product)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          onClick={() => deleteProduct(product.id)}
                          color="error"
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalProducts}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                borderTop: '1px solid #e2e8f0',
                bgcolor: '#f7fafc'
              }}
            />
          </TableContainer>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddProduct}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            transform: 'scale(1.1)'
          }
        }}
      >
        <Add />
      </Fab>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={productForm.title}
            onChange={(e) => setProductForm({...productForm, title: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={productForm.description}
            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Category"
            value={productForm.category}
            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Image URL"
            value={productForm.image}
            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;