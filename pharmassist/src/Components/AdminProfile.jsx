import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
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
    <div className="" style={{padding:"1rem 4rem",fontSize:"17px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem",padding:"1rem 2rem"}}>
            <h2>DETAILS</h2>
            <p>ADMIN NAME : {admin.adminEmail.toUpperCase().split("@GMAIL.COM")} </p>
            <p>ADMIN EMAIL : {admin.adminEmail.toUpperCase()} </p>
            <p>PHONE NO. : {admin.adminPhone} </p>
            <p>PHARMACY : {admin.adminPharmacy.toUpperCase()} </p>
            <Button variant="contained">EDIT PROFILE</Button>
        </div>
      
    </div>
  );
}

export default AdminProfile;
