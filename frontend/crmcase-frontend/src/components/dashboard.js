import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomerList from './customerList';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <CustomerList />
    </Box>
  );
};

export default Dashboard;