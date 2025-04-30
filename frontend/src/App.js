import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminSignup from './components/AdminSignup';
import AdminDashboard from './components/AdminDashboard';
import Orders from './components/Orders';
import Vendors from './components/Vendors';
import VendorDashboard from './components/VendorDashboard';
import AdminNavbar from './components/AdminNavbar';
import VendorNavbar from './components/VendorNavbar';
import VendorOrders from './components/VendorOrders';
import DlrMappingScreen from './components/DlrMappingScreen';
import ProductMasterScreen from './components/ProductMasterScreen';
import AdminInvoiceView from './components/AdminInvoiceView';
import VendorInvoiceUpload from './components/VendorInvoiceUpload';
import Reports from './components/Reports';
import OrderHistory from './components/OrderHistory';
import VendorReports from './components/VendorReports';
import ReportHistory from './components/ReportHistory';
import VendorFilesView from './components/VendorFilesView'; // ✅ This is already imported
import Send from './components/Send'; 
import AdminReports from './components/AdminReports';

// ✅ Admin layout: uses AdminNavbar and routes to admin pages
const AdminLayout = () => (
  <>
    <AdminNavbar />
    <div className="container">
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendor-orders" element={<VendorOrders />} />
        <Route path="/admin-invoices" element={<AdminInvoiceView />} />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/vendor-files/:vendorId" element={<VendorFilesView />} /> {/* ✅ Route added here */}
        <Route path="/dlr-mapping" element={<DlrMappingScreen />} />
        <Route path="/product-master" element={<ProductMasterScreen />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/report-history" element={<ReportHistory />} />
        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
      </Routes>
    </div>
  </>
);

// ✅ Vendor layout: uses VendorNavbar and routes to vendor pages
const VendorLayout = () => (
  <>
    <VendorNavbar />
    <div className="container">
      <Routes>
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/VendorOrders" element={<Orders />} />
        <Route path="/vendor-invoices" element={<VendorInvoiceUpload />} />
        <Route path="/vendor-report" element={<VendorReports />} />
        <Route path="/send" element={<Send />} /> 
        <Route path="*" element={<Navigate to="/vendor-dashboard" />} />
      </Routes>
    </div>
  </>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        {user ? (
          user.role === 'admin' ? (
            <Route path="/*" element={<AdminLayout />} />
          ) : (
            <Route path="/*" element={<VendorLayout />} />
          )
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
