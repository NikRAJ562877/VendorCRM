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
  useMediaQuery,
  useTheme,
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
  GroupAdd,
  Badge,
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {/* Orders */}
        <ListItemButton onClick={() => setOrdersOpen(!ordersOpen)}>
          <ListItemIcon><Inventory /></ListItemIcon>
          <ListItemText primary="Orders" />
          {ordersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={RouterLink} to="/orders" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              <ListItemText primary="Manage Orders" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/order-history" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Order History" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Vendor */}
        <ListItemButton onClick={() => setVendorOpen(!vendorOpen)}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Vendor Management" />
          {vendorOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={vendorOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={RouterLink} to="/vendors" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><GroupAdd /></ListItemIcon>
              <ListItemText primary="Vendors" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/Employee" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><Badge /></ListItemIcon>
              <ListItemText primary="Employee ID" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton component={RouterLink} to="/admin-invoices" onClick={() => isMobile && toggleDrawer()}>
          <ListItemIcon><Receipt /></ListItemIcon>
          <ListItemText primary="View Invoices" />
        </ListItemButton>

        <ListItemButton component={RouterLink} to="/admin-reports" onClick={() => isMobile && toggleDrawer()}>
          <ListItemIcon><ViewList /></ListItemIcon>
          <ListItemText primary="Submitted Reports" />
        </ListItemButton>

        <ListItemButton component={RouterLink} to="/dlr-mapping" onClick={() => isMobile && toggleDrawer()}>
          <ListItemIcon><Map /></ListItemIcon>
          <ListItemText primary="DLR Mapping" />
        </ListItemButton>

        {/* Reports */}
        <ListItemButton onClick={() => setReportOpen(!reportOpen)}>
          <ListItemIcon><Report /></ListItemIcon>
          <ListItemText primary="Reports" />
          {reportOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={reportOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton component={RouterLink} to="/product-master" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><Storage /></ListItemIcon>
              <ListItemText primary="Product Master" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/reports" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/report-history" sx={{ pl: 4 }} onClick={() => isMobile && toggleDrawer()}>
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
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
  position="fixed"
  sx={{
    zIndex: (theme) => theme.zIndex.drawer + 1,
    backgroundColor: 'silver',
    height: '64px', // Fixed height for the AppBar
  }}
>
  <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    {/* Menu Icon */}
    <IconButton
      color="inherit"
      edge="start"
      onClick={toggleDrawer}
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>

    {/* Logo - Center aligned in the left section */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1,
      }}
    >
      <Box
        component="img"
        src="/AutorexXZ.png"
        alt="Logo"
        sx={{ height: 100, width: 100 }} // Fixed size for the logo
      />
    </Box>
  </Toolbar>
</AppBar>


      {/* Drawer - responsive switch */}
      {/* Drawer */}
<Drawer
  variant={isMobile ? 'temporary' : 'persistent'}
  open={mobileOpen}
  onClose={toggleDrawer}
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

export default AdminLayout;
