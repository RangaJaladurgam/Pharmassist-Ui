import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  
  // Retrieve the pharmacyId from localStorage (assuming it is stored as a string)
  const pharmacyId = localStorage.getItem("pharmacyId");

  // Redirect to login if no token is available
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch medicines and filter those that belong to your pharmacy
  useEffect(() => {
    const fetchMedicine = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:7000/medicines",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status === 200 || status === 302,
          }
        );
        
        // Ensure the response has data and filter medicines based on pharmacyId
        const allMedicines = response.data?.data || [];
        const filteredMedicines = allMedicines.filter((medicine) => {
          return medicine?.pharmacyResponse?.pharmacyId === pharmacyId;
        });
        
        setMedicines(filteredMedicines);
      } catch (err) {
        console.error("Error fetching medicine:", err);
      }
    };

    fetchMedicine();
  }, [pharmacyId]);


  const handleAddMedicine = (medicine) => {
    console.log(medicine);
  } 

  return (
    <div style={{padding:"1rem 4rem"}}>
      <h2>Medicines</h2>
      <div className="">
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Manufacturer</th>
            <th>Medicine Name</th>
            <th>Dosage (Mg)</th>
            <th>Category</th>
            <th>Form</th>
            <th>Stock Quantity</th>
            <th>Expiry Date</th>
            <th>Price</th>
            {/* Add other headers as needed */}
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.medicineId }>
              <td>{medicine.manufacturer}</td>
              <td>{medicine.name}</td>
              <td>{medicine.dosageInMg}</td>
              <td>{medicine.category}</td>
              <td>{medicine.form}</td>
              <td>{medicine.stockQuantity}</td>
              <td>{medicine.expiryDate}</td>
              <td>{medicine.price}</td>
              <td><Button onClick={()=>handleAddMedicine(medicine)}>Add</Button></td>
            </tr>
          ))}
          {medicines.length === 0 && (
            <tr>
              <td colSpan="8">No medicines found for your pharmacy.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      
    </div>
  );
}

export default Dashboard;
