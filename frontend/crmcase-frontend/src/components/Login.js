import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError('Giriş işlemi başarısız oldu. Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Giriş
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Kullanıcı Adı"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;