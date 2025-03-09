import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FloatingForm = ({ showForm, setShowForm }) => {

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pharmacyName: "",
    gstNo: "",
    licenseNo: "",
  });

  const [errors, setErrors] = useState({
    pharmacyName: "",
    gstNo: "",
    licenseNo: "",
  });

  if (!showForm) return null;

  // Validation Regex Patterns 
  const nameRegex = /^[A-Za-z\s'-]{1,50}$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
  const licenseRegex = /^[A-Z0-9]{8,15}$/;

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  // Validation Function
  const validateForm = () => {
    let valid = true;
    const newErrors = { pharmacyName: "", gstNo: "", licenseNo: "" };

    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = "Name cannot be blank";
      valid = false;
    } else if (!nameRegex.test(formData.pharmacyName)) {
      newErrors.pharmacyName = "Invalid Name";
      valid = false;
    }

    if (!formData.gstNo.trim()) {
      newErrors.gstNo = "GST No. cannot be blank";
      valid = false;
    } else if (!gstRegex.test(formData.gstNo)) {
      newErrors.gstNo =
        "Invalid GST number. It should be 15 characters long, starting with 2 digits followed by 10 alphanumeric characters and ending with 3 alphanumeric characters.";
      valid = false;
    }

    if (!formData.licenseNo.trim()) {
      newErrors.licenseNo = "License No. cannot be blank";
      valid = false;
    } else if (!licenseRegex.test(formData.licenseNo)) {
      newErrors.licenseNo =
        "Invalid license number. It should be between 8 and 15 characters, consisting of uppercase letters and numbers only.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        }
    }, [navigate]);

    const handleAddPharmacy = async () => {
        const token = localStorage.getItem("token"); // Retrieve token
      
        try {
          const response = await axios.post(
            "http://localhost:7000/admins/pharmacy",
            {
                name : formData.pharmacyName,
                gstNo : formData.gstNo,
                licenseNo : formData.licenseNo
            }, // Send formData directly
            {
              headers: { Authorization: `Bearer ${token}` },
              validateStatus: (status) => status === 200 || status === 201,
            }
          );
      
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
      };

  // Handle Form Submission
  const handlePharmacySubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      handleAddPharmacy();
      setShowForm(false); // Close form on success
      window.location.reload(); // Refresh the page
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowForm(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 10,
        }}
      ></div>

      {/* Form Box */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          zIndex: 20,
          minWidth: "50%",
        }}
      >
        <form
          onSubmit={handlePharmacySubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h3>Link Pharmacy</h3>

          <TextField
            fullWidth
            label="Pharmacy Name"
            variant="outlined"
            name="pharmacyName"
            value={formData.pharmacyName}
            onChange={handleChange}
            error={!!errors.pharmacyName}
            helperText={errors.pharmacyName}
            required
          />

          <TextField
            fullWidth
            label="Pharmacy GST No."
            variant="outlined"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            error={!!errors.gstNo}
            helperText={errors.gstNo}
            required
          />

          <TextField
            fullWidth
            label="License Number"
            variant="outlined"
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            error={!!errors.licenseNo}
            helperText={errors.licenseNo}
            required
          />

          <div>
            <Button variant="contained" type="submit" color="primary">
              Submit
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outlined"
              color="error"
              style={{ marginLeft: "1rem" }}
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FloatingForm;
