import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Chip } from '@mui/material';
import { AccessTime, LocalShipping, CheckCircle, Cancel } from '@mui/icons-material';

const OrderStatusTracker = ({ order }) => {
  const [activeStep, setActiveStep] = useState(0);

  const getSteps = () => {
    if (order.status?.toUpperCase() === 'CANCELLED') {
      return [
        { label: 'Order Placed', icon: <AccessTime /> },
        { label: 'Cancelled', icon: <Cancel />, error: true }
      ];
    }
    return [
      { label: 'Order Placed', icon: <AccessTime /> },
      { label: 'Processing', icon: <LocalShipping /> },
      { label: 'Delivered', icon: <CheckCircle /> }
    ];
  };

  const steps = getSteps();

  useEffect(() => {
    switch (order.status?.toUpperCase()) {
      case 'PENDING':
        setActiveStep(0);
        break;
      case 'PROCESSING':
        setActiveStep(1);
        break;
      case 'DELIVERED':
        setActiveStep(order.status?.toUpperCase() === 'CANCELLED' ? 1 : 2);
        break;
      case 'CANCELLED':
        setActiveStep(1);
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
          <Step key={step.label} completed={index < activeStep || (step.error && index === activeStep)}>
            <StepLabel 
              icon={step.icon}
              error={step.error && index === activeStep}
            >
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
      
      {order.status?.toUpperCase() === 'CANCELLED' && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Chip 
            label="Order was cancelled" 
            color="error" 
            variant="outlined" 
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderStatusTracker;