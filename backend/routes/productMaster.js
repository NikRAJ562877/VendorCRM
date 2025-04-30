const express = require("express");
const router = express.Router();
const Product = require("../models/ProductMaster");

// ✅ Save product
router.post("/add-product", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line
    try {
        const { category, partNo, productName, amount } = req.body;

        if (!category || !partNo || !productName || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({ category, partNo, productName, amount });
        await newProduct.save();
        
        res.json({ message: "Product saved successfully!" });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: "Error saving product", error: error.message });
    }
});
router.get("/getProducts", async (req, res) => {
    const { category } = req.query;
    let query = {};

    if (category) {
        query.category = category; // Filter products by category if provided
    }

    const products = await Product.find(query);
    res.json(products);
  });
module.exports = router;
