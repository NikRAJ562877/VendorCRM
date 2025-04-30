const express = require("express");
const router = express.Router();
const DlrMapping = require("../models/DlrMapping");
const Vendor = require("../models/Vendor");
const order = require("../models/Order");
// ✅ Fetch all vendors for dropdown
router.get("/vendors", async (req, res) => {
    try {
        const vendors = await Vendor.find();  // Fetch vendors from MongoDB
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching vendors" });
    }
});

// ✅ Save DLR Mapping
router.post("/map", async (req, res) => {
    const { vendorId, dlrCodes,date } = req.body;

    console.log("Received request body:", req.body);

    if (!vendorId || !dlrCodes || !Array.isArray(dlrCodes) || dlrCodes.length === 0) {
        console.log("Invalid data format");
        return res.status(400).json({ error: "Vendor ID and at least one DLR Code are required" });
    }

    try {
        const { vendorId, dlrCodes } = req.body;

        if (!Array.isArray(dlrCodes)) {
            return res.status(400).json({ error: "DLR codes must be an array" });
        }

        const newMapping = new DlrMapping({
            vendorId,
            dlrCodes,date
        });

        await newMapping.save();
        res.status(201).json(newMapping);
    } catch (error) {
        console.error("Error saving mapping:", error);
        res.status(500).json({ error: "Failed to save mapping" });
    }
});
router.get("/unmapped-dlr-codes", async (req, res) => {
    const orders = await order.find({}, "dlrCode Product").lean();
    console.log("Orders fetched:", orders);
    const { product } = req.query;
   // console.log("Received product:", req.query);  // Log it here
       // const allDlrCodes = [...new Set(orders.map(order => order.dlrCode))];
        let filteredOrders = orders;
        console.log(product+"---");
        if (product) {
            filteredOrders = orders.filter(o => o.Product && o.Product.toLowerCase().startsWith(product.toLowerCase()));
            console.log("Filtered Order"+filteredOrders)
        }
      
        const allDlrCodes = [...new Set(filteredOrders.map(order => order.dlrCode))];
      
        // Fetch all mapped DLR codes from DlrMapping
        const mappedDlrEntries = await DlrMapping.find({}, "dlrCodes").lean();
        const mappedDlrCodes = new Set(mappedDlrEntries.flatMap(entry => entry.dlrCodes)); // Use Set for faster lookup
      
        // Filter out mapped DLR codes
        const unmappedDlrCodes = allDlrCodes.filter(code => !mappedDlrCodes.has(code)); // Check in Set
      
      
        res.json(unmappedDlrCodes);
  });
  
  router.get("/mapping", async (req, res) => {
    try {
      const mappings = await DlrMapping.find();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mappings" });
    }
  });
router.get("/mappings/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;
        const mapping = await DlrMapping.findOne({ vendorId });

        if (!mapping) {
            return res.status(404).json({ error: "Mapping not found" });
        }

        res.json(mapping);
    } catch (error) {
        console.error("Error fetching mapping:", error);
        res.status(500).json({ error: "Error fetching mapping" });
    }
});
router.put("/mappings/:id", async (req, res) => {
    try {
        const { vendorId, dlrCodes } = req.body;
        const updatedMapping = await DlrMapping.findByIdAndUpdate(req.params.id, { vendorId, dlrCodes }, { new: true });
        res.json(updatedMapping);
    } catch (error) {
        console.error("Error updating mapping:", error);
        res.status(500).json({ error: "Error updating mapping" });
    }
});

router.delete("/mappings/:id", async (req, res) => {
    try {
        await DlrMapping.findByIdAndDelete(req.params.id);
        res.json({ message: "Mapping deleted successfully!" });
    } catch (error) {
        console.error("Error deleting mapping:", error);
        res.status(500).json({ error: "Error deleting mapping" });
    }
});
module.exports = router;  
