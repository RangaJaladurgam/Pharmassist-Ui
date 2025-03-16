import React, { useEffect, useState } from "react";
import axios from "axios";

function Patients() {
  const [patients, setPatients] = useState([]);
  const topCustomer = localStorage.getItem("mostFrequentPatient");
  let count = 0;

  useEffect(() => {
    const handleFindAllPatients = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:7000/pharmacy/patients",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status === 200 || status === 302,
          }
        );
        setPatients(response.data.data);
      } catch (error) {
        console.log(error);
        setPatients([]);
      }
    };
    handleFindAllPatients();
  }, []);

  return (
    <div>
      <div
        style={{
          margin: "1rem 4.5rem",
        }}
      >
        <table className="patient-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>patient Name</th>
              <th>Gender</th>
              <th>PhoneNumber</th>
              <th>email Id</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientId} style={
                topCustomer === patient.name ? {background:"gold"} : {}
            }>
                <td>{(count = count + 1)}</td>
                <td >{patient.name}</td>
                <td>{patient.gender}</td>
                <td>{patient.phoneNumber}</td>
                <td>{patient.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
