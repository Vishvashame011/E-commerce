import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Rating, TextField, Button,
  Avatar, Divider, Pagination, Alert, Chip, LinearProgress
} from '@mui/material';
import { Person, Star, StarBorder, AccessTime } from '@mui/icons-material';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ 
    averageRating: 0, 
    totalRatings: 0, 
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [showAddReview, setShowAddReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchReviews();
    fetchStats();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.REVIEWS.GET(productId), {
        params: { page: page - 1, size: 10 }
      });
      console.log('Reviews response:', response.data);
      setReviews(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.REVIEWS.STATS(productId));
      setStats({
        averageRating: response.data.averageRating || 0,
        totalRatings: response.data.totalRatings || 0,
        ratingDistribution: response.data.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ 
        averageRating: 0, 
        totalRatings: 0, 
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert('Please login to add a review');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.REVIEWS.ADD(productId), newReview, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNewReview({ rating: 5, review: '' });
      setShowAddReview(false);
      fetchReviews();
      fetchStats();
      alert('Review added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error adding review');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      console.log('Raw date from API:', dateString); // Debug log
      
      if (!dateString) {
        return 'Just now';
      }
      
      let date;
      
      // Handle different date formats from backend
      if (typeof dateString === 'string') {
        if (dateString.includes('T')) {
          // ISO format: 2024-01-15T10:30:00
          date = new Date(dateString);
        } else if (dateString.includes(' ')) {
          // Format: 2024-01-15 10:30:00
          date = new Date(dateString.replace(' ', 'T'));
        } else if (dateString.includes('-')) {
          // Date only: 2024-01-15
          date = new Date(dateString + 'T00:00:00');
        } else {
          // Timestamp
          const timestamp = parseInt(dateString);
          date = new Date(timestamp);
        }
      } else if (typeof dateString === 'number') {
        // Direct timestamp
        date = new Date(dateString);
      } else if (Array.isArray(dateString) && dateString.length >= 3) {
        // Array format: [2024, 1, 15, 10, 30, 0]
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime()) || date.getFullYear() < 2020) {
        console.warn('Invalid date detected:', dateString);
        return 'Recently';
      }
      
      // Format the date
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }) + ' today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
    } catch (error) {
      console.error('Date formatting error:', error, 'Input:', dateString);
      return 'Recently';
    }
  };

  const getUserName = (review) => {
    if (review.user) {
      const firstName = review.user.firstName || '';
      const lastName = review.user.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      if (fullName) {
        return fullName;
      }
      
      if (review.user.username) {
        return review.user.username;
      }
    }
    
    return 'Anonymous User';
  };

  const getInitials = (name) => {
    if (name === 'Anonymous User') return 'A';
    const words = name.split(' ');
    return words.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success.main';
    if (rating >= 3) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews & Ratings
      </Typography>

      {/* Review Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
            {/* Overall Rating */}
            <Box sx={{ textAlign: 'center', minWidth: 200 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </Typography>
              <Rating value={stats.averageRating || 0} readOnly precision={0.1} size="large" />
              <Typography variant="body2" color="text.secondary">
                Based on {stats.totalRatings} reviews
              </Typography>
            </Box>

            {/* Rating Distribution */}
            {stats.totalRatings > 0 && (
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="h6" gutterBottom>Rating Breakdown</Typography>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.ratingDistribution[star] || 0;
                  const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                  
                  return (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                        <Typography variant="body2" sx={{ mr: 0.5 }}>{star}</Typography>
                        <Star sx={{ fontSize: 16, color: 'gold' }} />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ 
                          flex: 1, 
                          mx: 2, 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: 'grey.200'
                        }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right' }}>
                        {count} users ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Add Review Button */}
          {!showAddReview && (
            <Button 
              variant="contained" 
              onClick={() => setShowAddReview(true)}
              startIcon={<Star />}
              disabled={!isAuthenticated}
              size="large"
            >
              {isAuthenticated ? 'Write a Review' : 'Login to Write Review'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Add Review Form */}
      {showAddReview && (
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Share Your Experience</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography component="legend" sx={{ mb: 1 }}>Your Rating *</Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => 
                  setNewReview(prev => ({ ...prev, rating: newValue }))
                }
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Write your review (optional)"
              placeholder="Tell others about your experience with this product..."
              value={newReview.review}
              onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={handleAddReview}
                disabled={loading || !newReview.rating}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setShowAddReview(false)}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Customer Reviews ({stats.totalRatings})
      </Typography>

      {reviews.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <StarBorder sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>No reviews yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Be the first to share your experience with this product!
            </Typography>
            {isAuthenticated && !showAddReview && (
              <Button 
                variant="contained" 
                onClick={() => setShowAddReview(true)}
                startIcon={<Star />}
              >
                Write First Review
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {reviews.map((review, index) => {
            const userName = getUserName(review);
            const initials = getInitials(userName);
            const reviewDate = formatDate(review.createdAt);
            
            return (
              <Card key={review.id} sx={{ mb: 2, border: `1px solid ${getRatingColor(review.rating)}20` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {initials}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {userName}
                        </Typography>
                        {index < 3 && (
                          <Chip 
                            label="Top Reviewer" 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        )}
                        <Chip 
                          label={`${review.rating} ⭐`} 
                          size="small" 
                          sx={{ 
                            bgcolor: getRatingColor(review.rating),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {reviewDate}
                          </Typography>
                        </Box>
                      </Box>
                      {review.review && (
                        <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6, fontStyle: 'italic' }}>
                          "{review.review}"
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Add Review at Bottom */}
          {!showAddReview && isAuthenticated && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => setShowAddReview(true)}
                startIcon={<Star />}
              >
                Add Your Review
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProductReviews;