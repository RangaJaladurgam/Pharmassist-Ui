import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Util.css";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const validateInputs = () => {
    let isValid = true;

    if (email.trim() === "") {
      setEmailError("Email cannot be blank");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password cannot be blank");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        "http://localhost:7000/auth/login",
        { email, password },
        { validateStatus: (status) => status === 200 || status === 401 }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        await axios.get("http://localhost:7000/admins/profile", {
          headers: { Authorization: `Bearer ${response.data.token}` },
          validateStatus: (status) => status === 200 || status === 302,
        });

        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setError("Invalid Credentials!!");
      }
    } catch (error) {
      setError("Server Not Responding!!");
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleLogin} className="form">
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          fullWidth
        />
        <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
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
            style={{
              fontSize: "18px",
              flexBasis: "10%",
              border: "none",
              backgroundColor: "transparent",
            }}
            onClick={() =>  setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className="fa-solid fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
          </Button>
        </div>
        

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
          Login
        </Button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

const styles = {
  error: { color: "red" },
};

export default Login;
