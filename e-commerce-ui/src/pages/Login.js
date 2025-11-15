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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
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
      setError('');
      
      // Show success message based on type
      if (data.type === 'EMAIL_VERIFICATION') {
        setSuccessMessage(`OTP has been sent to your email: ${data.email}`);
      } else {
        setSuccessMessage(`OTP has been sent to your mobile number: ${data.mobileNumber}`);
      }
    } else {
      handleOtpSuccess(data);
    }
  };

  const handleOtpResend = () => {
    setError('');
    if (otpData.type === 'EMAIL_VERIFICATION') {
      setSuccessMessage(`OTP resent to your email: ${otpData.identifier}`);
    } else {
      setSuccessMessage(`OTP resent to your mobile number: ${otpData.identifier}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.userId && data.mobileNumber) {
          setOtpData({ identifier: data.mobileNumber, type: 'LOGIN' });
          setOtpStep(true);
          setError('');
          setSuccessMessage(`OTP has been sent to your mobile number: ${data.mobileNumber}. Check console for OTP.`);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email
          }));
          window.location.reload();
        }
      } else {
        setError(data.error || ERROR_MESSAGES.UNAUTHORIZED);
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
          Login
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        
        {!otpStep ? (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username/Email"
            name="username"
            value={formData.username}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Box textAlign="center">
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/signup')}
              type="button"
            >
              Don't have an account? Sign up
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

export default Login;