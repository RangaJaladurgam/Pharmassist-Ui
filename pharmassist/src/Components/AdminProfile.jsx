import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

function AdminProfile() {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin)); // Parse JSON before setting state
    }
  }, []);
  console.log(admin);
  return (
    <div style={{ padding: "1rem 4rem", fontSize: "17px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem 2rem",
        }}
      >
        <h2>DETAILS</h2>
        <p>ADMIN NAME : {admin.email ? admin.email.toUpperCase().split("@GMAIL.COM")[0] : "N/A"}</p>
        <p>ADMIN EMAIL : {admin.email?.toUpperCase() || "N/A"}</p>
        <p>PHONE NO. : {admin.phoneNumber || "N/A"} </p>
        <p>PHARMACY : {admin.pharmacyResponse? admin.pharmacyResponse.name :"N/A"} </p>
        <Button variant="contained">EDIT PROFILE</Button>
      </div>
    </div>
  );
}

export default AdminProfile;
