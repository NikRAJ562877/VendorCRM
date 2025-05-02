import React, { useState } from 'react';
import apiClient from '../api/auth';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  Paper,
} from '@mui/material';

const Employee = () => {
  const [EmployeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient({
        endpoint: '/employee',
        method: 'POST',
        body: { EmployeeId, name, email, password },
      });
      setMessage(res.message);
      setMessageType('success');
      setEmployeeId('');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Error creating Employee');
      setMessageType('error');
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 4,
        maxWidth: 600,
        margin: 'auto',
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" gutterBottom align="center">
          Create Employee ID
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Employee ID"
                variant="outlined"
                fullWidth
                value={EmployeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Create Employee
              </Button>
            </Grid>
          </Grid>
        </form>

        {message && (
          <Alert severity={messageType} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Employee;
