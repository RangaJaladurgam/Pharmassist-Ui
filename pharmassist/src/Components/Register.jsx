import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Util.css";

function Register() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Password validation logic
  useEffect(() => {
    if (password && cnfPassword) {
      if (password === cnfPassword) {
        setCheckPassword(true);
        setMessage("✅ Passwords match!");
      } else {
        setCheckPassword(false);
        setMessage("❌ Passwords do not match.");
      }
    } else {
      setMessage("");
    }
  }, [password, cnfPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !phoneNumber || !password || !cnfPassword) {
      alert("❌ Please fill all fields.");
      return;
    }

    if (!checkPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7000/register", {
        email,
        phoneNumber,
        password
      });

      console.log("✅ Registration Successful", response);
      alert("✅ Registration Successful!");
      
      // Reset form after successful registration
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setCnfPassword("");
      setMessage("");

    } catch (err) {
      console.error("❌ Registration Failed", err);
      alert("❌ Registration Failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Phone"
          type="tel"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={cnfPassword}
          onChange={(e) => setCnfPassword(e.target.value)}
          fullWidth
          required
        />
        
        {/* Password Match Message */}
        {message && <p style={{ color: checkPassword ? "green" : "red", fontSize: "12px" }}>{message}</p>}

        <Button 
          type="submit" 
          variant="contained" 
          style={{ backgroundColor: "#4792e6", color: "white", marginTop: "10px" }}
          fullWidth
        >
          Register
        </Button>
      </form>
    </div>
  );
}

export default Register;
