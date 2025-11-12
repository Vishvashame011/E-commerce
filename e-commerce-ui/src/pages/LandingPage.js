import React, { useState, useEffect, useMemo } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Container, Typography, CircularProgress, Box, Pagination, Paper, Divider, Slider, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, PRODUCTS_PER_PAGE, ERROR_MESSAGES } from '../config/api';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Fetch all products once
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  // Calculate max price when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      const max = Math.max(...allProducts.map(p => p.price));
      setMaxPrice(Math.ceil(max));
      setPriceRange([0, Math.ceil(max)]);
    }
  }, [allProducts]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products at once (increase size to get all)
      const response = await axios.get(API_ENDPOINTS.PRODUCTS, {
        params: { page: 0, size: 1000 } // Get all products
      });
      
      if (response.data.products) {
        setAllProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setAllProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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

  // Filter and sort products (client-side)
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return a.title.localeCompare(b.title);
          case 'name-desc': return b.title.localeCompare(a.title);
          case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
          default: return 0;
        }
      });
    }

    return filtered;
  }, [allProducts, selectedCategory, searchTerm, priceRange, sortBy]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchTerm(''); // Clear search when changing category
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            placeholder="Search by name, description, or category..."
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
              <MenuItem value="rating-desc">Highest Rated</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
        {/* Left Sidebar - Filters */}
        <Paper sx={{ 
          width: 280, 
          p: 2, 
          height: 'fit-content', 
          position: 'sticky', 
          top: 180,
          flexShrink: 0,
          borderRadius: 2,
          boxShadow: 2
        }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          
          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Category</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              sx={{ mt: 2 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Quick Sort Options */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Quick Sort</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={sortBy === 'price-asc'} onChange={() => setSortBy(sortBy === 'price-asc' ? '' : 'price-asc')} />}
                label="Price: Low to High"
              />
              <FormControlLabel
                control={<Checkbox checked={sortBy === 'price-desc'} onChange={() => setSortBy(sortBy === 'price-desc' ? '' : 'price-desc')} />}
                label="Price: High to Low"
              />
              <FormControlLabel
                control={<Checkbox checked={sortBy === 'name-asc'} onChange={() => setSortBy(sortBy === 'name-asc' ? '' : 'name-asc')} />}
                label="Name: A to Z"
              />
              <FormControlLabel
                control={<Checkbox checked={sortBy === 'name-desc'} onChange={() => setSortBy(sortBy === 'name-desc' ? '' : 'name-desc')} />}
                label="Name: Z to A"
              />
              <FormControlLabel
                control={<Checkbox checked={sortBy === 'rating-desc'} onChange={() => setSortBy(sortBy === 'rating-desc' ? '' : 'rating-desc')} />}
                label="Highest Rated"
              />
            </FormGroup>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          pl: 3,
          pr: 2
        }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Our Products
        </Typography>
        
        {/* Show search/filter info */}
        {(searchTerm || selectedCategory) && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm && selectedCategory && ' in '}
              {/* {selectedCategory && `Category: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`} */}
            </Typography>
          </Box>
        )}
        
        {paginatedProducts.length === 0 ? (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            {searchTerm || selectedCategory ? 
              'No products found matching your search criteria.' : 
              'No products available.'
            }
          </Typography>
        ) : (
          <>
            <div className="product-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mt: 4, 
                mb: 4,
                gap: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1} to {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                </Typography>
                
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      minWidth: '40px',
                      height: '40px'
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;