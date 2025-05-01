import React, { useState, useEffect } from "react";
import apiClient from "../api/auth"; // Importing the apiClient

const OrderForm = () => {
  const [categories] = useState(["Ultra Premium PPF", "Ceramic Coating"]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [rows, setRows] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await apiClient({ endpoint: "/dlr/vendors" });
        const filtered = data
          .filter((v) => v.role === "vendor")
          .map((v) => ({ value: v.vendorId, label: v.vendorId }));
        setVendors(filtered);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await apiClient({ endpoint: "/products/getProducts" });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchVendors();
    fetchProducts();
  }, []);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { category: "", partNo: "", productName: "", amount: 0, qty: 1, total: 0 },
    ]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    calculateFinalTotal(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];

    if (field === "category") {
      updated[index] = {
        ...updated[index],
        category: value,
        partNo: "",
        productName: "",
        amount: 0,
        total: 0,
      };
    } else if (field === "partNo") {
      const selected = products.find((p) => p.partNo === value);
      if (selected) {
        updated[index] = {
          ...updated[index],
          partNo: value,
          productName: selected.productName,
          amount: selected.amount,
          total: selected.amount * updated[index].qty,
        };
      }
    } else if (field === "qty") {
      const qty = Number(value);
      updated[index] = {
        ...updated[index],
        qty,
        total: updated[index].amount * qty,
      };
    } else {
      updated[index][field] = value;
    }

    setRows(updated);
    calculateFinalTotal(updated);
  };

  const calculateFinalTotal = (rows) => {
    const total = rows.reduce((sum, row) => sum + row.total, 0);
    setFinalTotal(total);
  };

  const handleSubmit = async () => {
    if (!selectedVendor) return alert("Please select a vendor.");
    if (!selectedMonth) return alert("Please select a month.");
    if (rows.length === 0) return alert("Please add at least one order row.");

    try {
      const response = await apiClient({
        endpoint: "/reports",
        method: "POST",
        body: {
          vendor: selectedVendor,
          month: selectedMonth,
          reports: rows,
          finalTotal,
        },
      });

      if (response) {
        alert("Report saved successfully!");
        setRows([]);
        setFinalTotal(0);
        setSelectedVendor("");
        setSelectedMonth("");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Order Form</h2>

      {/* Vendor Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Vendor:</label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="border p-3 w-full rounded-lg"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* Month Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-3 w-full rounded-lg"
        >
          <option value="">-- Select Month --</option>
          {Array.from({ length: 12 }, (_, i) => {
            const month = new Date(0, i).toLocaleString("default", { month: "long" });
            return (
              <option key={i + 1} value={i + 1}>
                {month}
              </option>
            );
          })}
        </select>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Category</th>
              <th className="border p-3">Part No</th>
              <th className="border p-3">Product Name</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="border p-3">
                  <select
                    value={row.category}
                    onChange={(e) => handleRowChange(i, "category", e.target.value)}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-3">
                  <select
                    value={row.partNo}
                    onChange={(e) => handleRowChange(i, "partNo", e.target.value)}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="">Select Part No</option>
                    {products
                      .filter((p) => p.category === row.category)
                      .map((p) => (
                        <option key={p.partNo} value={p.partNo}>
                          {p.partNo}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="border p-3">{row.productName}</td>
                <td className="border p-3">
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) => handleRowChange(i, "qty", e.target.value)}
                    className="border p-2 w-20 text-center rounded-md"
                  />
                </td>
                <td className="border p-3">{row.amount}</td>
                <td className="border p-3">{row.total}</td>
                <td className="border p-3">
                  <button
                    onClick={() => removeRow(i)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-6">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white text-sm md:text-base px-4 py-2 md:px-6 md:py-2 rounded-md"
          disabled={!selectedVendor || !selectedMonth} // Disable if no vendor/month selected
        >
          Add Row
        </button>
        <h3 className="text-lg md:text-xl font-bold text-center">Final Total: ₹{finalTotal}</h3>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white text-sm md:text-base px-4 py-2 md:px-6 md:py-2 rounded-md"
          disabled={rows.length === 0}
        >
          Save Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
