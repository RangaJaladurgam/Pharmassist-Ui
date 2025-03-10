import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMedicine = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:7000/medicines", {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status === 200 || status === 302,
        });

        const allMedicines = response.data?.data || [];
        const today = new Date().toISOString().split("T")[0];

        const filteredMedicines = allMedicines.filter(
          (medicine) => medicine.stockQuantity > 0 && medicine.expiryDate >= today
        );

        setMedicines(filteredMedicines);
      } catch (err) {
        console.error("Error fetching medicine:", err);
      }
    };

    fetchMedicine();
  }, []);

  // Load cart data from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartList");
    if (savedCart) {
      setCartList(JSON.parse(savedCart));
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }, [cartList]);

  const handleAddMedicine = useCallback((medicine) => {
    setCartList((prev) => {
      return prev.map((item) =>
        item.medicineId === medicine.medicineId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stockQuantity) }
          : item
      ).concat(!prev.some((item) => item.medicineId === medicine.medicineId) ? [{ ...medicine, quantity: 1 }] : []);
    });
  }, []);

  const handleQuantityChange = useCallback((medicineId, newQuantity) => {
    setCartList((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stockQuantity)) }
          : item
      )
    );
  }, []);

  const handleRemove = useCallback((medicineId) => {
    setCartList((prev) => prev.filter((item) => item.medicineId !== medicineId));
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  const totalCartValue = useMemo(() => {
    return cartList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartList]);

  return (
    <div style={{ padding: "1rem 4rem" }} className="dashboard-container">
      <div className="dashboard-left-container">
        <div className="left-inner">
          <h2>Cart</h2>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Medicine Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartList.map((medicine) => (
                <tr key={medicine.medicineId}>
                  <td style={{ textAlign: "center" }}>{medicine.manufacturer}</td>
                  <td style={{ textAlign: "center" }}>{medicine.name} {medicine.dosageInMg}mg</td>
                  <td style={{ textAlign: "center" }}>₹{medicine.price}</td>
                  <td style={{ textAlign: "center" }}>
                    <TextField
                      type="number"
                      value={medicine.quantity}
                      onChange={(e) => handleQuantityChange(medicine.medicineId, parseInt(e.target.value, 10) || 1)}
                      inputProps={{ min: 1, max: medicine.stockQuantity }}
                      size="small"
                      style={{ width: "4rem"}}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>₹{medicine.price * medicine.quantity}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button color="error" onClick={() => handleRemove(medicine.medicineId)}>
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {cartList.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>Empty Cart</td>
                </tr>
              )}
              {cartList.length > 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
                  <td colSpan="2">₹{totalCartValue}</td>
                </tr>
              )}
            </tbody>
          </table>
          <footer  style={{backgroundColor:"red",position:"fixed"}}>
          ₹{totalCartValue}
          </footer>
        </div>
        {cartList.length > 0 && (
            <Button variant="contained" color="primary" style={{ marginTop: "10px" }}>
              Checkout
            </Button>
          )}
          
      </div>

      <div className="dashboard-right-container">
        <div className="right-inner">
          <input
            style={{ padding: "0.2rem 0.5rem", width: "70%" }}
            type="text"
            placeholder="Search Medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr>
                <th>Manufacturer</th>
                <th>Medicine Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.medicineId}>
                  <td>{medicine.manufacturer}</td>
                  <td>{medicine.name} {medicine.dosageInMg}mg</td>
                  <td>₹{medicine.price}</td>
                  <td>{medicine.stockQuantity}</td>
                  <td>
                    <Button
                      onClick={() => handleAddMedicine(medicine)}
                      disabled={cartList.some(item => item.medicineId === medicine.medicineId && item.quantity >= medicine.stockQuantity)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
