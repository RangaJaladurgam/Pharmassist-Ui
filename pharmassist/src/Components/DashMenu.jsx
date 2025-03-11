import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import FloatingForm from "./FloatingForm "; // Import the floating form

function DashMenu() {
  const navigate = useNavigate();
  const [checkPharmacy, setCheckPharmacy] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to show the form

  const menuItems = ["Dashboard","Upload Medicines", "Transactions", "Patients","Show Admins"];

  if (checkPharmacy) menuItems.unshift("Link Pharmacy");
  else menuItems.push("Show Pharmacy");

  // Checking if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Checking if pharmacy is present
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:7000/admins/profile", {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status === 200 || status === 302,
        });

        response.data.data.pharmacyResponse == null
          ? setCheckPharmacy(true)
          : setCheckPharmacy(false);
        
        // Store necessary details in local storage
        if (response.data.data.pharmacyResponse) {
          localStorage.setItem("adminId", response.data.data.adminId);
          localStorage.setItem("adminEmail", response.data.data.email);
          localStorage.setItem("pharmacyId", response.data.data.pharmacyResponse.pharmacyId);
          localStorage.setItem("pharmacyName", response.data.data.pharmacyResponse.name);
          localStorage.setItem("gstNumber", response.data.data.pharmacyResponse.gstNo);
          localStorage.setItem("licenseNo", response.data.data.pharmacyResponse.licenseNo);
        }

      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="dash-menu-container" style={{ borderBottom: "1px dashed #a59797b0", padding: "0.1rem 4rem",backgroundColor:"white" }}>
      <ul className="dash-menu" style={{ display: "flex", gap: "1rem" }}>
        {menuItems.map((item) => (
          <li
            className="menu-item"
            style={{ listStyleType: "none" }}
            key={item}
            onClick={() => {
              if (item === "Link Pharmacy") setShowForm(true); // Open the floating form
              if (item === "Show Pharmacy") navigate("/show-pharmacy");
              if(item === "Dashboard") navigate("/dasboard");
            }}
          >
            <Button color={item !== "Link Pharmacy" ? "primary" : "error"}>{item}</Button>
          </li>
        ))}
      </ul>

      {/* Floating Form Component */}
      {showForm && <FloatingForm showForm={showForm} setShowForm={setShowForm} />}
    </div>
  );
}

export default DashMenu;
