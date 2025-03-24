import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    region: customer?.region || '',
    registrationDate: customer?.registrationDate || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    onSave({ ...customer, ...formData });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#ffffff',
        maxWidth: 500,
        mx: 'auto',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        Müşteri Formu
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="İsim"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Soyisim"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bölge"
            name="region"
            value={formData.region}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Kayıt Tarihi"
            name="registrationDate"
            type="date"
            value={formData.registrationDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          Kaydet
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          İptal
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerForm;