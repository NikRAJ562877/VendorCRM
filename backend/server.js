const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (ensure your .env contains MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const adminsRoutes = require('./routes/admins');  
const vendorsRoutes = require('./routes/vendors');
const ordersRoutes = require('./routes/orders');
const vendorOrdersRoutes = require('./routes/vendorOrders');
const dlrRoutes = require("./routes/dlrRoutes");
const orderHistoryRoutes = require('./routes/orderhistory'); 
const productRoutes = require('./routes/productMaster');
const vendorInvoicesRoutes = require('./routes/vendorInvoices');  
const adminInvoicesRoutes = require('./routes/adminInvoices');
const reportRoutes = require('./routes/reportRoutes');
const reportHistoryRoute = require("./routes/reporthistory");
 

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use("/api/order", ordersRoutes);
app.use('/api/vendorOrders', vendorOrdersRoutes);
app.use("/api/orderhistory", orderHistoryRoutes); 
app.use("/api/dlr", dlrRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendor-invoices", vendorInvoicesRoutes);
app.use("/api/admin-invoices", adminInvoicesRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reporthistory", reportHistoryRoute);
app.use("/api/send", require("./routes/send"));
 

const PORT = process.env.PORT || 5000;
console.log("✅ Routes Loaded:", app._router.stack.map(r => r.route && r.route.path));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
