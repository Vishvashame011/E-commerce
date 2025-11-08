import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Chip } from '@mui/material';
import { AccessTime, LocalShipping, CheckCircle } from '@mui/icons-material';

const OrderStatusTracker = ({ order }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Order Placed', icon: <AccessTime /> },
    { label: 'Processing', icon: <LocalShipping /> },
    { label: 'Delivered', icon: <CheckCircle /> }
  ];

  useEffect(() => {
    switch (order.status?.toUpperCase()) {
      case 'PENDING':
        setActiveStep(0);
        break;
      case 'PROCESSING':
        setActiveStep(1);
        break;
      case 'DELIVERED':
        setActiveStep(2);
        break;
      default:
        setActiveStep(0);
    }
  }, [order.status]);

  const getTimeRemaining = () => {
    if (order.status?.toUpperCase() === 'PENDING') {
      const orderTime = new Date(order.orderDate || order.order_date);
      const deliveryTime = new Date(orderTime.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
      const now = new Date();
      const remaining = deliveryTime - now;
      
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m remaining`;
      }
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel icon={step.icon}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {getTimeRemaining() && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Chip 
            label={getTimeRemaining()} 
            color="warning" 
            variant="outlined" 
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderStatusTracker;