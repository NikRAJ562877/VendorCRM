import React, { useState } from 'react';
import apiClient from '../api/auth'; // Import the apiClient
import { TextField, Button, Box, Typography, Alert } from '@mui/material'; // MUI components

const Vendors = () => {
  const [vendorId, setVendorId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Success or Error

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use apiClient to send the POST request
      const res = await apiClient({
        endpoint: '/vendors',
        method: 'POST',
        body: { vendorId, name, email, password },
      });
      setMessage(res.message); // Assuming the response has a 'message' field
      setMessageType('success');
      setVendorId('');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Error creating vendor');
      setMessageType('error');
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Create Vendor
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Vendor ID"
            variant="outlined"
            fullWidth
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Create Vendor
          </Button>
        </Box>
      </form>

      {message && (
        <Alert severity={messageType} sx={{ marginTop: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default Vendors;
