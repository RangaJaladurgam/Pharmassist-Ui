import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

function Transactions() {
  const [bills, setBills] = useState([]);
  const [billPrinted, setBillPrinted] = useState(false);

  useEffect(() => {
    const handleFindAllBills = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:7000/pharmacy/bills/find-all",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status === 200 || status === 302,
          }
        );

        // Sort bills in descending order based on `dateTime`
        const sortedBills = response.data.data.sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );

        setBills(sortedBills);
      } catch (error) {
        console.log(error);
        setBills([]);
      }
    };
    handleFindAllBills();
  }, []);

  const handlePrintBill = async (billId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:7000/bills/${billId}/generate`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Handle binary response
        }
      );

      // Create a blob object from the response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `pharmacy-bill-${billId}.pdf`; // Set filename dynamically

      // Append to the document and trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      setBillPrinted(true);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      style={{
        margin: "1rem 4.5rem",
        display: "flex"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flexBasis:"70%"
        }}
      >
        {bills.map((bill) => (
          <div
            key={bill.billId}
            style={{
              width: "100%",
              border: "1px dashed rgb(0, 110, 255)",
              padding: "1rem",
              borderRadius: "10px",
              background: "rgb(255, 255, 255)",
              background:
                "linear-gradient(221deg, rgba(255,255,255,0.9) 0%, rgba(128,183,255,0.400) 74%, rgba(0,110,255,0.5) 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h4>BILL ID : {bill.billId}</h4>
              <p>
                <span style={{ color: "rgb(0, 110, 255)" }}>
                  {formatDateTime(bill.dateTime)}
                </span>{" "}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td>PATIENT NAME</td>
                    <td> : </td>
                    <td>{bill.patientResponse.name.toUpperCase()} </td>
                  </tr>
                  <tr>
                    <td>PAYMENT MODE</td>
                    <td> : </td>
                    <td>{bill.paymentMode} </td>
                  </tr>
                  <tr>
                    <td>PAID AMOUNT</td>
                    <td> : </td>
                    <td> ₹ {bill.totalPayableAmount} </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(0, 110, 255)",
                    width: "8rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => handlePrintBill(bill.billId)}
                >
                  PRINT &nbsp;<i className="fa-solid fa-file-arrow-down"></i>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{flexBasis:"30%"}}>
        

      </div>
    </div>
  );
}

export default Transactions;
