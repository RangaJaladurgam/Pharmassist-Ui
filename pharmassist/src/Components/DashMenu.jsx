import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
function DashMenu() {
  const navigate = useNavigate();

  const [checkPharmacy, setCheckPharmacy] = useState(false);

  const menuItems = ["Upload Medicines", "Transactions", "Patients"];

  if (checkPharmacy) menuItems.unshift("Link Pharmacy")
    else menuItems.push("Show Pharmacy");

  //checking logged in or not
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if no token
    }
  }, [navigate]);

  //for checking pharmacy present or not to display LINK PHARMACY if not present
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:7000/admins/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status === 200 || status === 302, // Accept both 200 and 302
          }
        );

        response.data.data.pharmacyResponse == null
          ? setCheckPharmacy(true)
          : setCheckPharmacy(false);
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  return (
    <div
      className="dash-menu-container"
      style={{ borderBottom: "1px dotted #a59797b0", padding: "0.1rem 4rem" }}
    >
      <ul className="dash-menu" style={{ display: "flex", gap: "1rem" }}>
        {menuItems.map((item) => (
          <li
            className="menu-item"
            style={{ listStyleType: "none" }}
            key={item}
            onClick={() => {
              if (item === "Link Pharmacy") navigate("/");
            }}
          >
            <Button color={item!=="Link Pharmacy" ? "primary" : "error"}>{item}</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashMenu;
