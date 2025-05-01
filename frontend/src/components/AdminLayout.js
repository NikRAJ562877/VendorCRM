import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Box,
   
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  ExpandLess,
  ExpandMore,
  Inventory,
  People,
  Receipt,
  Report,
  Storage,
  History,
  ViewList,
  Map,
  ShoppingCart,
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(true); // Start as open
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpenDrawer(!openDrawer)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer Component */}
      <Drawer
        variant="persistent"
        open={openDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'transform 0.3s ease-in-out', // Smooth transition
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton onClick={() => setOrdersOpen(!ordersOpen)}>
              <ListItemIcon><Inventory /></ListItemIcon>
              <ListItemText primary="Orders" />
              {ordersOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={RouterLink} to="/orders" sx={{ pl: 4 }}>
                  <ListItemText><ShoppingCart /></ListItemText>
                  <ListItemText primary="Manage Orders" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/order-history" sx={{ pl: 4 }}>
                  <ListItemText><History/></ListItemText>
                  <ListItemText primary="Order History" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton component={RouterLink} to="/vendors">
              <ListItemIcon><People /></ListItemIcon>
              <ListItemText primary="Vendor Management" />
            </ListItemButton>

            <ListItemButton component={RouterLink} to="/admin-invoices">
              <ListItemIcon><Receipt /></ListItemIcon>
              <ListItemText primary="View Invoices" />
            </ListItemButton>

            <ListItemButton component={RouterLink} to="/admin-reports">
              <ListItemIcon><ViewList /></ListItemIcon>
              <ListItemText primary="Submitted Reports" />
            </ListItemButton>

            <ListItemButton component={RouterLink} to="/dlr-mapping">
              <ListItemIcon><Map /></ListItemIcon>
              <ListItemText primary="DLR Mapping" />
            </ListItemButton>

            <ListItemButton onClick={() => setReportOpen(!reportOpen)}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText primary="Reports" />
              {reportOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={reportOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton component={RouterLink} to="/product-master" sx={{ pl: 4 }}>
                  <ListItemIcon><Storage /></ListItemIcon>
                  <ListItemText primary="Product Master" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/reports" sx={{ pl: 4 }}>
                  <ListItemText><Report/></ListItemText>
                  <ListItemText primary="Reports" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/report-history" sx={{ pl: 4 }}>
                  <ListItemIcon><History /></ListItemIcon>
                  <ListItemText primary="Report History" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: 'margin 0.3s',
          marginLeft: openDrawer ? `${drawerWidth}px` : '0px', // Main content shifts
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
