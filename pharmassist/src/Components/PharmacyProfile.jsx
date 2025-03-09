import React from "react";
import { Card, CardContent, Typography, Container, Box } from "@mui/material";
function PharmacyProfile() {
  return (
    <div>
      <div>Pharmacy Profile</div>
      <Container maxWidth="sm">
      <Card sx={{ mt: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Pharmacy Profile
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1"><strong>Name:</strong> {localStorage.getItem("pharmacyName")}</Typography>
            <Typography variant="body1"><strong>GST No:</strong> {localStorage.getItem("gstNumber")}</Typography>
            <Typography variant="body1"><strong>License No:</strong> {localStorage.getItem("licenseNo")}</Typography>
            <Typography variant="body1"><strong>Managed by</strong> {localStorage.getItem("adminEmail")}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </div>
  );
}

export default PharmacyProfile;
