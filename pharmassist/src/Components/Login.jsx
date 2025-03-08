import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Util.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) =>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:7000/login",{email,password});
            localStorage.setItem("token",response.data.token);
            navigate("/dashboard");

        }
        catch(err){
            setError("Invalid Email or password");
        }

    }
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
          style={{ backgroundColor: "#4792e6", color: "white", marginTop: "10px" }}
          fullWidth
        >
          Login
        </Button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link> </p>
    </div>
  )
}

const styles = {
    container: { maxWidth: "300px", margin: "50px auto", textAlign: "center" },
    error: { color: "red" },
};

export default Login