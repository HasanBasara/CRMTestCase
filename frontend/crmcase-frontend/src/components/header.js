import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CRM Yönetim Sistemi
        </Typography>
        {user && (
          <Box>
            <Typography variant="body1" sx={{ display: 'inline', mr: 2 }}>
              Hoşgeldiniz, {user.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;