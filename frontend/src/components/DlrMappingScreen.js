import React, { useState, useEffect } from "react";
import Select from "react-select";
import apiClient from "../api/auth"; // ✅ centralized apiClient
import "../css/DlrMappingScreen.css";

const DlrMappingScreen = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dlrCodeOptions, setDlrCodeOptions] = useState([]);
  const [selectedDlrCodes, setSelectedDlrCodes] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [productCategory, setProductCategory] = useState(null);

  const productOptions = [
    { value: "Ceramic Coating", label: "Ceramic Coating" },
    { value: "Ultra Premium PPF", label: "Ultra Premium PPF" },
  ];

  useEffect(() => {
    fetchVendors();
    fetchMappings();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await apiClient({ endpoint: "/dlr/vendors" });
      setVendors(res.map(v => ({ value: v.vendorId, label: v.vendorId })));
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchDlrCodes = async (product) => {
    try {
      const res = await apiClient({
        endpoint: `/dlr/unmapped-dlr-codes?product=${encodeURIComponent(product)}`
      });
      setDlrCodeOptions(res.map(code => ({ value: code, label: code })));
    } catch (error) {
      console.error("Error fetching unmapped DLR codes:", error);
    }
  };

  const fetchMappings = async () => {
    try {
      const res = await apiClient({ endpoint: "/dlr/mapping" });
      setMappings(res);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVendor || selectedDlrCodes.length === 0) {
      alert("Please select a vendor and at least one DLR code.");
      return;
    }

    const payload = {
      vendorId: selectedVendor.value,
      dlrCodes: selectedDlrCodes.map(d => d.value),
      date: selectedDate,
    };

    try {
      if (editId) {
        await apiClient({
          endpoint: `/dlr/mappings/${editId}`,
          method: "PUT",
          body: payload,
        });
        alert("Mapping updated successfully!");
        fetchDlrCodes(productCategory?.value);
      } else {
        await apiClient({
          endpoint: "/dlr/map",
          method: "POST",
          body: payload,
        });
        alert("Mapping added successfully!");
      }

      setSelectedDlrCodes([]);
      setSelectedVendor(null);
      setEditId(null);
      setSelectedDate("");
      fetchMappings();
    } catch (error) {
      alert(error?.error || "Failed to map DLR Code.");
    }
  };

  const handleEdit = (mapping) => {
    setSelectedVendor(vendors.find(v => v.value === mapping.vendorId));
    setSelectedDlrCodes(mapping.dlrCodes.map(code => ({ value: code, label: code })));
    setSelectedDate(mapping.date || "");
    setEditId(mapping._id);
  };

  return (
    <div className="dlr-mapping-container">
      <h2>DLR Code to Vendor Mapping</h2>

      <div className="dlr-form-row">
        <div className="dlr-form-group">
          <label>Select Vendor:</label>
          <Select
            className="dlr-select-container"
            options={vendors}
            value={selectedVendor}
            onChange={setSelectedVendor}
            placeholder="Search & select vendor"
            menuPlacement="auto"
            menuPosition="fixed"
          />
        </div>

        <div className="dlr-form-group">
          <label>Select Product Category:</label>
          <Select
            className="dlr-input-field"
            options={productOptions}
            value={productCategory}
            onChange={(selectedOption) => {
              setProductCategory(selectedOption);
              fetchDlrCodes(selectedOption?.value);
            }}
            placeholder="Select Product Category"
            menuPlacement="auto"
            menuPosition="fixed"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 1000 }) }}
          />
        </div>

        <div className="dlr-form-group">
          <label>Select DLR Codes:</label>
          <Select
            className="dlr-input-field"
            options={dlrCodeOptions}
            value={selectedDlrCodes}
            onChange={setSelectedDlrCodes}
            placeholder="Select DLR Codes"
            isMulti
            menuPlacement="auto"
            menuPosition="fixed"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 1000 }) }}
          />
        </div>

        <div className="dlr-form-group">
          <label>Select Date:</label>
          <input
            type="date"
            className="dlr-date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary">
        {editId ? "Update Mapping" : "Map DLR Code"}
      </button>

      <h3>Existing Mappings</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>DLR Codes</th>
              <th>Mapped Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping) => (
              <tr key={mapping._id}>
                <td>{mapping.vendorId}</td>
                <td>{mapping.dlrCodes.join(", ")}</td>
                <td>{mapping.date || "Not Set"}</td>
                <td>
                  <button onClick={() => handleEdit(mapping)} className="btn btn-warning">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DlrMappingScreen;
