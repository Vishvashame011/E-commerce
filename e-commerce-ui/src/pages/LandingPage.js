import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Container, Typography, CircularProgress, Box, Pagination, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, PRODUCTS_PER_PAGE, ERROR_MESSAGES } from '../config/api';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts(0);
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchProducts(0);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (!selectedCategory) {
      setCurrentPage(1);
      fetchProducts(0);
    }
  }, [searchTerm]);

  const fetchProducts = async (page = 0) => {
    try {
      setLoading(true);
      let url;
      let params = `page=${page}&size=${PRODUCTS_PER_PAGE}`;
      
      if (selectedCategory) {
        // Fetch category-specific products with pagination
        url = `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY(selectedCategory)}?${params}`;
      } else {
        // Fetch all products with pagination
        url = `${API_ENDPOINTS.PRODUCTS}?${params}`;
      }
      
      // Add search term if present
      if (searchTerm && !selectedCategory) {
        params += `&search=${encodeURIComponent(searchTerm)}`;
        url = `${API_ENDPOINTS.PRODUCTS}?${params}`;
      }
      
      const response = await axios.get(url);
      
      if (selectedCategory && !response.data.products) {
        // Handle category response (array format)
        const categoryProducts = response.data || [];
        const filteredProducts = searchTerm ? 
          categoryProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          ) : categoryProducts;
        
        // Manual pagination for category products
        const startIndex = page * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
        setTotalPages(Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
      } else {
        // Handle paginated response
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
      }
      
      setCurrentPage(page + 1);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCT_CATEGORIES);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchTerm(''); // Clear search when changing category
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchProducts(page - 1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <div className="search-filter-container">
        <div className="search-filter-row">
          <TextField
            label="Search products..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 300, flex: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Our Products
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {products.length === 0 && !loading ? (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No products found matching your criteria.
          </Typography>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Container>
  );
};

export default LandingPage;