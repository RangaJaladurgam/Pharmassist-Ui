import React, { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const FloatingPatientForm = ({ closeForm , setAddPatient,custPhoneNumber }) => {
  const [customer, setCustomer] = useState({
    name: "",
    phoneNumber: custPhoneNumber,
    email: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "",
  });

  // Validation Regex Patterns
  const nameRegex = /^[A-Za-z\s]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,6}$/;

  // Handle input changes
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate Form
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", phoneNumber: "", email: "", gender: "" };

    if (!customer.name.trim()) {
      newErrors.name = "Name cannot be blank";
      valid = false;
    } else if (!nameRegex.test(customer.name)) {
      newErrors.name = "Invalid Name. Only letters and spaces allowed.";
      valid = false;
    }

    if (!customer.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number cannot be blank";
      valid = false;
    } else if (!phoneRegex.test(customer.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
      valid = false;
    }

    if (!customer.email.trim()) {
      newErrors.email = "Email cannot be blank";
      valid = false;
    } else if (!emailRegex.test(customer.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!customer.gender.trim()) {
      newErrors.gender = "Gender selection is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Form Submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
        try{
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:7000/pharmacy/patients",{
                name : customer.name,
                phoneNumber : customer.phoneNumber,
                email : customer.email,
                gender : customer.gender.toUpperCase()
            }, // Send formData directly
            {
              headers: { Authorization: `Bearer ${token}` },
              validateStatus: (status) => status === 200 || status === 201,
            })
            
        }catch(err){
            console.log(err);
        }

      
      closeForm();
      alert("Patient Added...");
    }
  };

  return (
    <>
      {/* Dimming Background */}
      <div
        className="backdrop"
        onClick={closeForm}
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

      {/* Floating Form */}
      <div
        className="form-container"
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
          minWidth: "40%",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3>Add Patient</h3>

          <TextField
            fullWidth
            label="Patient Name"
            variant="outlined"
            name="name"
            value={customer.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={customer.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={customer.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <TextField
            select
            fullWidth
            label="Gender"
            variant="outlined"
            name="gender"
            value={customer.gender}
            onChange={handleChange}
            error={!!errors.gender}
            helperText={errors.gender}
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <div>
            <Button variant="contained" type="submit" color="primary">
              Save
            </Button>
            <Button onClick={closeForm} variant="outlined" color="error" style={{ marginLeft: "1rem" }}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FloatingPatientForm;
