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
          (medicine) =>
            medicine.stockQuantity > 0 && medicine.expiryDate >= today
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
      return prev
        .map((item) =>
          item.medicineId === medicine.medicineId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stockQuantity),
              }
            : item
        )
        .concat(
          !prev.some((item) => item.medicineId === medicine.medicineId)
            ? [{ ...medicine, quantity: 1 }]
            : []
        );
    });
  }, []);

  const handleQuantityChange = useCallback((medicineId, newQuantity) => {
    setCartList((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(newQuantity, item.stockQuantity)),
            }
          : item
      )
    );
  }, []);

  const handleRemove = useCallback((medicineId) => {
    setCartList((prev) =>
      prev.filter((item) => item.medicineId !== medicineId)
    );
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
          <p>Cart</p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
            }}
          >
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
                  <td style={{ textAlign: "center" }}>
                    {medicine.manufacturer}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {medicine.name} {medicine.dosageInMg / 10}mg
                  </td>
                  <td style={{ textAlign: "center" }}>₹{medicine.price}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      value={medicine.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          medicine.medicineId,
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                      slotProps={{ min: 1, max: medicine.stockQuantity }}
                      size="small"
                      style={{
                        width: "4rem",
                        height: "1rem",
                        border: "none",
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    ₹{medicine.price * medicine.quantity}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      color="error"
                      onClick={() => handleRemove(medicine.medicineId)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {cartList.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center",paddingBlock:"1rem" }}>
                    Empty Cart
                  </td>
                </tr>
              )}
              {cartList.length > 0 && (
                <tr style={{ backgroundColor: "rgb(0, 167, 8)" }}>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      paddingBlock: "0.5rem",
                      color: "white",
                    }}
                  >
                    Total:
                  </td>
                  <td
                    colSpan="2"
                    style={{
                      fontWeight: "bold",
                      paddingBlock: "0.5rem",
                      fontSize: "12px",
                      color: "white",
                    }}
                  >
                    ₹{totalCartValue}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {cartList.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Checkout
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginTop: "10px" }}
          >
            ₹ {totalCartValue}
          </Button>
        </div>
      </div>

      <div className="dashboard-right-container">
        <div className="right-inner">
          <input
            style={{
              padding: "0.2rem 0.5rem",
              width: "70%",
              border: "1px dashed blue",
            }}
            type="text"
            placeholder="Search Medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="medicine-table">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
              }}
            >
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
                    <td>
                      {medicine.name} {medicine.dosageInMg / 10}mg
                    </td>
                    <td>₹{medicine.price}</td>
                    <td>{medicine.stockQuantity}</td>
                    <td>
                      <Button
                        onClick={() => handleAddMedicine(medicine)}
                        disabled={cartList.some(
                          (item) =>
                            item.medicineId === medicine.medicineId &&
                            item.quantity >= medicine.stockQuantity
                        )}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign:"center",paddingBlock:"1rem"}}>No Medicines Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
