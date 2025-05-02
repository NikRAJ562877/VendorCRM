import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  ExpandLess,
  ExpandMore,
  Inventory,
  History,
  
} from '@mui/icons-material';

const drawerWidth = 260;

const EmpLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(false);
 
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {/* Orders */}
        <ListItemButton onClick={() => setOrdersOpen(!ordersOpen)}>
          <ListItemIcon><Inventory /></ListItemIcon>
          <ListItemText primary="Orders" />
          {ordersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={RouterLink} to="/order-history" sx={{ pl: 4 }}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Order History" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Logout */}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'silver',
          height: '64px'
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
               
            }}
          >
            <Box
              component="img"
              src="/AutorexXZ.png"
              alt="Logo"
              sx={{ height: 100, width: 100 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer */}
      {/* Drawer */}
<Drawer
  variant={isMobile ? 'temporary' : 'persistent'}
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{ keepMounted: true }}
  sx={{
    display: 'block',
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }}
>
  <Toolbar />
  {drawerContent}
</Drawer>

{/* Main Content */}
<Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    mt: 8,
    ml: isMobile ? 0 : `${drawerWidth}px`, // ✅ Only add margin on desktop
  }}
>
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmpLayout;
