import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Container, Box } from "@mui/material";
import axios from "axios";
function AdminProfile() {
  const [admin, setAdmin] = useState({
    adminEmail: "",
    adminPhone: "",
    adminPharmacy: "",
  });

  useEffect(() => {
    const loadAdminProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:7000/admins/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status === 200 || status === 302,
          }
        );
        setAdmin({
          adminEmail: response.data.data.email,
          adminPhone: response.data.data.phoneNumber,
          adminPharmacy: response.data.data.pharmacyResponse.name,
        });
      } catch (err) {
        console.log(err);
      }
    };

    loadAdminProfile();
  }, []);

  return (
    <div>
      <Container maxWidth="sm">
        <Card sx={{ mt: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Profile
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Email:</strong> {admin.adminEmail}
              </Typography>
              <Typography variant="body1">
                <strong>Phone No:</strong> {admin.adminPhone}
              </Typography>
              <Typography variant="body1">
                <strong>Pharmacy :</strong> {admin.adminPharmacy}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default AdminProfile;
