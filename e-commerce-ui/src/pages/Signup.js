import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Link,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../config/api';
import GoogleAuth from '../components/GoogleAuth';
import OtpVerification from '../components/OtpVerification';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email
    }));
    window.location.reload();
  };

  const handleGoogleSuccess = (data) => {
    if (data.otpRequired) {
      setOtpData({ identifier: data.email || data.mobileNumber, type: data.type });
      setOtpStep(true);
    } else {
      handleOtpSuccess(data);
    }
  };

  const handleOtpResend = () => {
    setError('');
    // Show success message or handle as needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.userId) {
          setOtpData({ identifier: formData.mobileNumber, type: 'SIGNUP' });
          setOtpStep(true);
          setError('');
        } else {
          navigate('/login');
        }
      } else {
        setError(data.error || ERROR_MESSAGES.VALIDATION_ERROR);
      }
    } catch (error) {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!otpStep ? (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <Box textAlign="center">
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/login')}
              type="button"
            >
              Already have an account? Login
            </Link>
          </Box>
          <Divider sx={{ my: 2 }}>OR</Divider>
          <GoogleAuth 
            onSuccess={handleGoogleSuccess}
            onError={setError}
          />
        </Box>
        ) : (
        <OtpVerification
          identifier={otpData.identifier}
          type={otpData.type}
          onSuccess={handleOtpSuccess}
          onError={setError}
          onResend={handleOtpResend}
        />
        )}
      </Paper>
    </Container>
  );
};

export default Signup;