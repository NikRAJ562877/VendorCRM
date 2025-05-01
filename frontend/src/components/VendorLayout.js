// src/components/layouts/VendorLayout.js
import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Home as HomeIcon,
  CloudUpload as UploadIcon,
  BarChart as ReportIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

export default function VendorLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const items = [
    { to: '/vendor-dashboard', label: 'Home', icon: <HomeIcon /> },
    { to: '/vendor-invoices', label: 'Upload Invoice', icon: <UploadIcon /> },
    { to: '/vendor-report', label: 'Report View', icon: <ReportIcon /> },
    { to: '/send', label: 'Send', icon: <SendIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen((o) => !o)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Vendor Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {items.map(({ to, label, icon }) => (
            <ListItemButton
              key={to}
              component={RouterLink}
              to={to}
              onClick={() => {}}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: open ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
