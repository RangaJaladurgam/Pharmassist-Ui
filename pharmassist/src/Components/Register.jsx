import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./Util.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailExistsMessage, setEmailExistsMessage] = useState("");

  // Validation Messages
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cnfPasswordError, setCnfPasswordError] = useState("");

  // Regex Patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

  // Password validation logic
  useEffect(() => {
    if (password && cnfPassword) {
      if (password === cnfPassword) {
        setCheckPassword(true);
        setCnfPasswordError("");
      } else {
        setCheckPassword(false);
        setCnfPasswordError("Passwords do not match.");
      }
    } else {
      setMessage("");
    }
  }, [password, cnfPassword]);

  const validateInputs = () => {
    let isValid = true;

    if (!emailRegex.test(email)) {
      setEmailError("❌ Invalid Gmail ID (must end with @gmail.com).");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError(
        "❌ Invalid phone number (must be 10 digits, starting with 6-9)."
      );
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "❌ Password must be 8-12 chars, with one uppercase, one lowercase, one number, and one special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!passwordRegex.test(cnfPassword)) {
      setCnfPasswordError(
        "❌ Password must be 8-12 chars, with one uppercase, one lowercase, one number, and one special character."
      );
      isValid = false;
    } else {
      setCnfPasswordError("");
    }

    if (!checkPassword) {
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:7000/register", {
        email,
        phoneNumber,
        password,
      });

      alert("✅ Registration Successful!");
      navigate("/auth/login");

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
  const checkEmailExists = async() => {
    if (!email) return;
    try {
      const response = await axios.get("http://localhost:7000/admins/"+email,{
        validateStatus : (status) => status === 200 || status === 302 || status === 404
      });
      if (response.status===302) {
        setEmailExistsMessage("Email already registered");
      } else {
        setEmailExistsMessage(""); // Clear error if email is available
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setEmailExistsMessage("⚠️ Unable to verify email");
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleRegister} className="form">
        <h2>Register</h2>
          <p style={{textAlign:"right",color:"red"}}>{emailExistsMessage}</p>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onBlur={checkEmailExists} // Check email when moving out of the field
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          fullWidth
          required
        />

        <TextField
          label="Phone"
          type="number"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={!!phoneError}
          helperText={phoneError} 
          fullWidth
        />
        <div style={{ display: "flex", width: "100%",gap:"0.2rem" }}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
          />
          <Button
            style={{fontSize:"18px", flexBasis: "10%",border:"none",backgroundColor:"transparent" }}
            onClick={() =>
              showPassword ? setShowPassword(false) : setShowPassword(true)
            }
          >
            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
          </Button>
        </div>
      
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={cnfPassword}
          onChange={(e) => setCnfPassword(e.target.value)}
          error={!!cnfPasswordError}
          helperText={cnfPasswordError}
          fullWidth
        />

        {/* Password Match Message */}
        {message && (
          <p
            style={{ color: checkPassword ? "green" : "red", fontSize: "12px" }}
          >
            {message}
          </p>
        )}

        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#4792e6",
            color: "white",
            marginTop: "10px",
          }}
          fullWidth
        >
          Register
        </Button>
      </form>
    </div>
  );
}

export default Register;
