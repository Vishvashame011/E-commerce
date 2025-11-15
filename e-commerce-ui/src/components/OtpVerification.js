import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

const OtpVerification = ({ identifier, type, onSuccess, onError, onResend }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      onError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          otp,
          type
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data);
      } else {
        onError(data.error || 'OTP verification failed');
      }
    } catch (error) {
      onError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await fetch(`${API_ENDPOINTS.AUTH.RESEND_OTP}?identifier=${identifier}&type=${type}`, {
        method: 'POST'
      });
      onResend && onResend();
    } catch (error) {
      onError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'SIGNUP': return 'Verify Your Mobile Number';
      case 'LOGIN': return 'Verify Your Login';
      case 'EMAIL_VERIFICATION': return 'Verify Your Email';
      default: return 'Verify OTP';
    }
  };

  const getDescription = () => {
    const contact = identifier.includes('@') ? 'email' : 'mobile number';
    return `We've sent an OTP to your ${contact}: ${identifier}`;
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {getTitle()}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {getDescription()}
      </Typography>
      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        margin="normal"
        required
        inputProps={{ maxLength: 6 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleResend}
        disabled={loading}
      >
        Resend OTP
      </Button>
    </Box>
  );
};

export default OtpVerification;