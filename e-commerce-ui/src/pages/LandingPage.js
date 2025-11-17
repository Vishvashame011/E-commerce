import React, { useState, useEffect, useMemo } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Container, Typography, CircularProgress, Box, Pagination, Paper, Divider, Slider, Checkbox, FormControlLabel, FormGroup, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, FilterList, TrendingUp, LocalOffer } from '@mui/icons-material';
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
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        mb: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Discover Amazing Products
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Shop from thousands of products with the best deals
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              maxWidth: 800, 
              mx: 'auto',
              bgcolor: 'white',
              borderRadius: 3,
              p: 1,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <TextField
                placeholder="Search products..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    border: 'none',
                    '& fieldset': { border: 'none' }
                  }
                }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: '#718096' }} />
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  displayEmpty
                  sx={{
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z to A</MenuItem>
                  <MenuItem value="rating-desc">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">

      <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
        {/* Left Sidebar - Filters */}
        <Card sx={{ 
          width: 280, 
          height: 'fit-content', 
          position: 'sticky', 
          top: 20,
          flexShrink: 0,
          borderRadius: 4,
          boxShadow: '0 25px 50px rgba(102, 126, 234, 0.15)',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(240, 147, 251, 0.02) 100%)',
            zIndex: -1
          }
        }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              zIndex: 0
            }
          }}>
            <FilterList sx={{ 
              mr: 1.5, 
              fontSize: 24,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              zIndex: 1
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 1
            }}>
              🎯 Filters
            </Typography>
          </Box>
          
          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: '#2d3748',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              📂 Category
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                displayEmpty
                sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                  },
                  '&.Mui-focused': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    border: '1px solid #667eea',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
              >
                <MenuItem value="" sx={{ fontWeight: 'bold', color: '#667eea' }}>✨ All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem 
                    key={category} 
                    value={category}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ 
            my: 2.5,
            background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 20%, rgba(240, 147, 251, 0.3) 80%, transparent 100%)',
            height: '2px',
            border: 'none',
            borderRadius: 1
          }} />

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: '#2d3748',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              💰 Price Range
            </Typography>
            <Box sx={{
              p: 2.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.08) 0%, rgba(245, 87, 108, 0.08) 100%)',
              border: '1px solid rgba(240, 147, 251, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                zIndex: 0
              }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#667eea',
                  textAlign: 'center',
                  mb: 2,
                  fontSize: '0.95rem',
                  zIndex: 1,
                  position: 'relative'
                }}
              >
                ${priceRange[0]} - ${priceRange[1]}
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                sx={{ 
                  color: '#667eea',
                  zIndex: 1,
                  position: 'relative',
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    border: '2px solid white',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'scale(1.1)'
                    }
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    height: 4,
                    borderRadius: 2
                  },
                  '& .MuiSlider-rail': {
                    background: 'rgba(102, 126, 234, 0.2)',
                    height: 4,
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ 
            my: 2.5,
            background: 'linear-gradient(90deg, transparent 0%, rgba(240, 147, 251, 0.3) 20%, rgba(102, 126, 234, 0.3) 80%, transparent 100%)',
            height: '2px',
            border: 'none',
            borderRadius: 1
          }} />

          {/* Quick Sort Options */}
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: '#2d3748',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              ⚡ Quick Sort
            </Typography>
            <FormGroup sx={{ gap: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sortBy === 'price-asc'} 
                    onChange={() => setSortBy(sortBy === 'price-asc' ? '' : 'price-asc')}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18
                      }
                    }}
                  />
                }
                label="💸 Price: Low to High"
                sx={{
                  borderRadius: 2,
                  p: 0.5,
                  m: 0,
                  transition: 'all 0.3s ease',
                  fontSize: '0.85rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    transform: 'translateX(5px)'
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem'
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sortBy === 'price-desc'} 
                    onChange={() => setSortBy(sortBy === 'price-desc' ? '' : 'price-desc')}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18
                      }
                    }}
                  />
                }
                label="💰 Price: High to Low"
                sx={{
                  borderRadius: 2,
                  p: 0.5,
                  m: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    transform: 'translateX(5px)'
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem'
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sortBy === 'name-asc'} 
                    onChange={() => setSortBy(sortBy === 'name-asc' ? '' : 'name-asc')}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18
                      }
                    }}
                  />
                }
                label="🔤 Name: A to Z"
                sx={{
                  borderRadius: 2,
                  p: 0.5,
                  m: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    transform: 'translateX(5px)'
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem'
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sortBy === 'name-desc'} 
                    onChange={() => setSortBy(sortBy === 'name-desc' ? '' : 'name-desc')}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18
                      }
                    }}
                  />
                }
                label="🔠 Name: Z to A"
                sx={{
                  borderRadius: 2,
                  p: 0.5,
                  m: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    transform: 'translateX(5px)'
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem'
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sortBy === 'rating-desc'} 
                    onChange={() => setSortBy(sortBy === 'rating-desc' ? '' : 'rating-desc')}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 18
                      }
                    }}
                  />
                }
                label="⭐ Highest Rated"
                sx={{
                  borderRadius: 2,
                  p: 0.5,
                  m: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
                    transform: 'translateX(5px)'
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.85rem'
                  }
                }}
              />
            </FormGroup>
          </Box>
        </CardContent>
        </Card>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          pl: 3,
          pr: 2
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <TrendingUp sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Featured Products
          </Typography>
        </Box>
        
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
            <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
              {paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
            
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
    </Box>
  );
};

export default LandingPage;