import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import apiClient from "../api/auth";

export default function AdminInvoiceView() {
  const [vendorIds, setVendorIds] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const invoices = await apiClient({ endpoint: "/admin-invoices" });
        const ids = Array.isArray(invoices)
          ? invoices.map((inv) => inv.vendorId)
          : invoices.data?.map((inv) => inv.vendorId) ?? [];
        setVendorIds([...new Set(ids)]);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setVendorIds([]);
      }
    })();
  }, []);

  const handleVendorClick = (id) => {
    navigate(`/vendor-files/${id}`);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Vendor Invoices
      </Typography>

      {vendorIds === null ? (
        <CircularProgress />
      ) : vendorIds.length === 0 ? (
        <Typography>No vendor invoices found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {vendorIds.map((id) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea onClick={() => handleVendorClick(id)}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vendor ID
                    </Typography>
                    <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                      {id}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
