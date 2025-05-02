import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is small (mobile)

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
<AppBar 
  position="fixed" 
  sx={{ 
    zIndex: (t) => t.zIndex.drawer + 1, 
    backgroundColor: 'silver', 
    height: 64, // Set a fixed height for the AppBar
  }}
>
  <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    {/* Menu Icon */}
    <IconButton
      color="inherit"
      edge="start"
      onClick={() => setOpen((prev) => !prev)}
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>

    {/* Logo Image */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Aligns logo to the left
        flexGrow: 1, // Ensures the space between logo and menu is maintained
      }}
    >
      <Box
        component="img"
        src="/AutorexXZ.png"
        alt="Logo"
        sx={{
          height: 100, // Adjust logo height (e.g., 60px)
          width: 'auto', // Maintain aspect ratio
        }}
      />
    </Box>
  </Toolbar>
</AppBar>



      <Drawer
        variant= 'persistent'
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          zIndex: 1,
        }}
        ModalProps={{
          keepMounted: true, // Improve performance on mobile
        }}
      >
        <Toolbar />
        <List>
          {items.map(({ to, label, icon }) => (
            <ListItemButton key={to} component={RouterLink} to={to} onClick={() => {}}>
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
          ml: open && !isMobile ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
