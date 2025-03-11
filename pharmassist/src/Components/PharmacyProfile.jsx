import React from "react";
import { Button } from "@mui/material";
function PharmacyProfile() {
  return (
    <div>
      <div className="" style={{ padding: "1rem 4rem", fontSize: "17px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem 2rem",
          }}
        >
          <h2>DETAILS</h2>
          <p>PHARMACY NAME : {localStorage.getItem("pharmacyName")} </p>
          <p>LICENSE NO. : {localStorage.getItem("licenseNo")} </p>
          <p>GST NO. : {localStorage.getItem("gstNumber")} </p>
          <p>ADMIN : {localStorage.getItem("adminEmail")} </p>
          <Button variant="contained">EDIT PROFILE</Button>
        </div>
      </div>
    </div>
  );
}

export default PharmacyProfile;
