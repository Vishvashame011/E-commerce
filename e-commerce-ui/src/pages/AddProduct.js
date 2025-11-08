import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField,
  Button, Grid, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress
} from '@mui/material';
import { CloudUpload, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: null,
    ratingRate: 4.0,
    ratingCount: 0
  });

  const categories = [
    'electronics',
    "men's clothing",
    "women's clothing",
    'jewelery'
  ];

  const handleInputChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProduct(prev => ({ ...prev, image: file }));
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.title || !product.price || !product.category || !product.image) {
      setError('Please fill all required fields and select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('ratingRate', product.ratingRate);
      formData.append('ratingCount', product.ratingCount);
      formData.append('image', product.image);

      await axios.post(API_ENDPOINTS.PRODUCTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>Product Added Successfully!</Typography>
          <Typography>Redirecting to home page...</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign="center">
            Add New Product
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Title *"
                  value={product.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price *"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={product.category}
                    label="Category"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    sx={{ minWidth: 200 }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category} sx={{ whiteSpace: 'nowrap' }}>
                        {category === "men's clothing" ? "Men's Clothing" :
                         category === "women's clothing" ? "Women's Clothing" :
                         category === "jewelery" ? "Jewelery" :
                         category === "electronics" ? "Electronics" :
                         category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2 }}
                    >
                      Upload Product Image *
                    </Button>
                  </label>
                  {product.image && (
                    <Typography variant="body2" color="success.main">
                      Selected: {product.image.name}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block" color="text.secondary">
                    Supported formats: All image types (JPG, PNG, GIF, WEBP, etc.)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Add Product'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddProduct;