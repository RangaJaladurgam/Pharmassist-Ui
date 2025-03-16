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

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found in localStorage:", token);
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/auth/login", {
        email: email,
        password: password,
      },{
        validateStatus : (status) => status === 200 || status === 401
      });
      console.log(response.data);

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        
        
        const admin = await axios.get("http://localhost:7000/admins/profile",{
          headers: { Authorization : `Bearer ${response.data.token}`},
          validateStatus: (status) => status === 200 || status === 302
        }) 

        setIsLoggedIn(true);
        navigate("/dashboard");
      } else if (response.status === 401) {
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
        Don't have an account? <Link to="/register">Register</Link>{" "}
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "300px", margin: "50px auto", textAlign: "center" },
  error: { color: "red" },
};

export default Login;
