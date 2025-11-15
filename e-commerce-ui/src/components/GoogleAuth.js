import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

const GoogleAuth = ({ onSuccess, onError }) => {
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [googleData, setGoogleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleLoaded = () => {
      console.log('Checking Google SDK...', window.google);
      if (window.google && window.google.accounts) {
        console.log('Google SDK loaded successfully');
        setGoogleLoaded(true);
        initializeGoogle();
      } else {
        console.log('Google SDK not loaded yet, retrying...');
        setTimeout(checkGoogleLoaded, 500);
      }
    };
    checkGoogleLoaded();
  }, []);

  const initializeGoogle = () => {
    const clientId = "565296682180-4cja25757tg9surmb81st40falb2t4h8.apps.googleusercontent.com";
    console.log('Initializing Google with client ID:', clientId);
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      console.log('Google initialized successfully');
    } catch (error) {
      console.error('Google initialization error:', error);
      onError('Failed to initialize Google Sign-In');
    }
  };

  const handleCredentialResponse = async (response) => {
    console.log('Google credential received:', response);
    const googleToken = response.credential;
    await handleGoogleLogin(googleToken);
  };

  const handleGoogleLogin = async (googleToken) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresSignup) {
          setGoogleData({ ...data, token: googleToken });
          setShowMobileDialog(true);
        } else if (data.email) {
          onSuccess({ otpRequired: true, email: data.email, type: 'EMAIL_VERIFICATION' });
        } else if (data.mobileNumber) {
          onSuccess({ otpRequired: true, mobileNumber: data.mobileNumber, type: 'SIGNUP' });
        } else {
          onSuccess(data);
        }
      } else {
        onError(data.error || 'Google authentication failed');
      }
    } catch (error) {
      onError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileSubmit = async () => {
    if (!mobileNumber.trim()) {
      onError('Mobile number is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: googleData.token, 
          mobileNumber: mobileNumber 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowMobileDialog(false);
        onSuccess({ otpRequired: true, mobileNumber: data.mobileNumber, type: 'SIGNUP' });
      } else {
        onError(data.error || 'Registration failed');
      }
    } catch (error) {
      onError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const initiateGoogleSignIn = () => {
    console.log('Google Sign-In button clicked');
    console.log('Google loaded:', googleLoaded);
    console.log('Window.google:', window.google);
    
    if (!googleLoaded) {
      onError('Google Sign-In is still loading. Please wait.');
      return;
    }

    try {
      console.log('Calling Google prompt...');
      window.google.accounts.id.prompt((notification) => {
        console.log('Google prompt notification:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google prompt not displayed, trying renderButton');
          renderGoogleButton();
        }
      });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError('Failed to show Google Sign-In: ' + error.message);
    }
  };

  const renderGoogleButton = () => {
    const buttonDiv = document.getElementById('google-signin-button');
    if (buttonDiv && window.google) {
      buttonDiv.innerHTML = '';
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with'
      });
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={initiateGoogleSignIn}
        disabled={loading || !googleLoaded}
        sx={{ mt: 2 }}
      >
        {loading ? 'Processing...' : !googleLoaded ? 'Loading Google...' : 'Continue with Google'}
      </Button>
      
      <div id="google-signin-button" style={{ marginTop: '8px', minHeight: '40px' }}></div>

      <Dialog open={showMobileDialog} onClose={() => setShowMobileDialog(false)}>
        <DialogTitle>Complete Your Registration</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Welcome {googleData?.name}! Please provide your mobile number to complete your account setup.
          </Alert>
          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMobileDialog(false)}>Cancel</Button>
          <Button onClick={handleMobileSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoogleAuth;