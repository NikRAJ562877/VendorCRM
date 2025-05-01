import React, { useState, useEffect } from "react";
import apiClient from "../api/auth"; // Import the apiClient
import "../css/Send.css";

const subcategoryOptions = [
  "Ceramic coating - One year", "Ceramic Coating - Two year", "Ceramic Coating - Three year",
  "Anti-Microbial treatment", "UV Protection", "Exterior Beautification", "Surface Refinement",
  "Windshield Polishing", "Windshield Ceramic", "Head Light & Tail Light Polishing", "Logo Cleaning",
  "Upholstery", "Germ Free", "AC Disinfectant", "Alloy Wheel Polishing", "Alloy Wheel Ceramic",
  "Engine Coating"
];

const Send = () => {
  const [category, setCategory] = useState("");
  const [dealers, setDealers] = useState([]);
  const [pastReports, setPastReports] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const vendorId = user.vendorId;

  useEffect(() => {
    const fetchPastReports = async () => {
      try {
        const res = await apiClient({ endpoint: `/send/vendor-reports?vendorId=${vendorId}` });
        setPastReports(res || []);
      } catch (err) {
        console.error("Failed to fetch past reports:", err);
      }
    };

    if (vendorId) fetchPastReports();
  }, [vendorId]);

  const addDealerForm = () => {
    setDealers((prev) => [
      ...prev,
      {
        id: Date.now(),
        dlrCode: "",
        dlrName: "",
        location: "",
        inputs: {},
        rejectionReason: null
      }
    ]);
  };

  const removeDealerForm = (index) => {
    const updated = [...dealers];
    updated.splice(index, 1);
    setDealers(updated);
  };

  const updateDealerField = (index, field, value) => {
    const updated = [...dealers];
    updated[index][field] = value;
    setDealers(updated);
  };

  const updateDealerInputs = (index, subcategory, size, value) => {
    const updated = [...dealers];
    updated[index].inputs = {
      ...updated[index].inputs,
      [subcategory]: {
        ...updated[index].inputs?.[subcategory],
        [size]: Math.max(0, value)
      }
    };
    setDealers(updated);
  };

  const fetchDealerDetails = async (index, dlrCode) => {
    if (!dlrCode) return;

    try {
      const res = await apiClient({ endpoint: `/send/dealer-details/${dlrCode}` });
      const { dlrName, Location, oldRejectedReport } = res;

      const updated = [...dealers];
      updated[index].dlrName = dlrName || "Not found";
      updated[index].location = Location || "Not found";

      if (oldRejectedReport) {
        updated[index].inputs = oldRejectedReport.reportData || {};
        updated[index].rejectionReason = oldRejectedReport.rejectionReason || null;
      }

      setDealers(updated);
    } catch (err) {
      console.error("Error fetching dealer details", err);
      const updated = [...dealers];
      updated[index].dlrName = "Not found";
      updated[index].location = "Not found";
      setDealers(updated);
    }
  };

  const handleSubmit = async () => {
    if (!vendorId) {
      alert("Vendor ID not found. Please log in.");
      return;
    }

    for (const dealer of dealers) {
      if (!dealer.dlrCode || !dealer.dlrName || !dealer.location) {
        alert("Please fill all required fields");
        return;
      }

      const payload = {
        company: category,
        dealerCode: dealer.dlrCode,
        dealerName: dealer.dlrName,
        location: dealer.location,
        reportData: dealer.inputs,
        vendorId: vendorId
      };

      try {
        await apiClient({
          endpoint: "/send/submit-report",
          method: "POST",
          body: payload
        });
        console.log("Submitted successfully");
      } catch (error) {
        console.error("Submission error:", error);
      }
    }

    setCategory("");
    setDealers([]);
  };

  return (
    <div className="send-wrapper">
      <div className="send-container">
        <h2>Send Reports</h2>

        <div className="form-row">
          <label>Company:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">-- Select Company --</option>
            <option value="HYUNDAI">HYUNDAI</option>
            <option value="VW SKODA">VW SKODA</option>
          </select>
        </div>

        {dealers.map((dealer, index) => (
          <div className="dealer-form" key={dealer.id}>
            <input
              placeholder="Dealer Code"
              value={dealer.dlrCode}
              onChange={(e) => {
                updateDealerField(index, "dlrCode", e.target.value);
                fetchDealerDetails(index, e.target.value);
              }}
            />
            <input placeholder="Dealer Name" value={dealer.dlrName} disabled />
            <input placeholder="Location" value={dealer.location} disabled />

            {dealer.rejectionReason && (
              <div className="rejection-box">
                <strong>Rejected:</strong> {dealer.rejectionReason}
              </div>
            )}

            {subcategoryOptions.map((sub) => (
              <div key={sub} className="subcategory-row">
                <label>{sub}</label>
                <input
                  type="number"
                  placeholder="S"
                  value={dealer.inputs?.[sub]?.S || ""}
                  onChange={(e) => updateDealerInputs(index, sub, "S", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="M"
                  value={dealer.inputs?.[sub]?.M || ""}
                  onChange={(e) => updateDealerInputs(index, sub, "M", parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="L"
                  value={dealer.inputs?.[sub]?.L || ""}
                  onChange={(e) => updateDealerInputs(index, sub, "L", parseInt(e.target.value))}
                />
              </div>
            ))}

            <button onClick={() => removeDealerForm(index)}>Remove</button>
          </div>
        ))}

        <button onClick={addDealerForm}>+ Add Dealer</button>
        <button onClick={handleSubmit}>Submit Report</button>
      </div>

      <div className="submitted-container">
        <h2>Submitted Reports</h2>
        {pastReports.length === 0 ? (
          <p>No reports submitted yet.</p>
        ) : (
          pastReports.map((report, i) => (
            <div key={i} className="submitted-report">
              <h4>{report.dealerName} ({report.dealerCode})</h4>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Status:</strong> {report.status}</p>

              {report.status === "Rejected" && (
                <p className="rejection-reason">
                  <strong>Rejection Reason:</strong> {report.rejectionReason}
                </p>
              )}

              <div className="report-data">
                {Object.entries(report.reportData || {}).map(([subcat, sizes]) => (
                  <div key={subcat} className="report-row">
                    <strong>{subcat}:</strong>
                    {Object.entries(sizes).map(([size, qty]) => (
                      <span key={size}> {size}: {qty} </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Send;
