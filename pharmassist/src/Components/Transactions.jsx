import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { textAlign } from "@mui/system";

function Transactions() {
  const [bills, setBills] = useState([]);
  const [billPrinted, setBillPrinted] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [yesterdaySales, setYesterdaySales] = useState(0);

  const [totalBills, setTotalBills] = useState(0);
  const [monthlyBills, setMonthlyBills] = useState(0);
  const [todayBills, setTodayBills] = useState(0);
  const [yesterdayBills, setYesterdayBills] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 4;

  useEffect(() => {
    const calculateStats = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Get start of today and yesterday
      const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      // 🔹 Total Sales (All time)
      const total = bills.reduce(
        (sum, bill) => sum + bill.totalPayableAmount,
        0
      );

      // 🔹 Total Bills (All time)
      const totalBillCount = bills.length;

      // 🔹 Monthly Sales & Bills
      const monthlyBillsList = bills.filter((bill) => {
        const billDate = new Date(bill.dateTime);
        return (
          billDate.getMonth() === currentMonth &&
          billDate.getFullYear() === currentYear
        );
      });
      const monthlyTotal = monthlyBillsList.reduce(
        (sum, bill) => sum + bill.totalPayableAmount,
        0
      );

      // 🔹 Today's Sales & Bills
      const todayBillsList = bills.filter(
        (bill) => new Date(bill.dateTime) >= todayStart
      );
      const todayTotal = todayBillsList.reduce(
        (sum, bill) => sum + bill.totalPayableAmount,
        0
      );

      // 🔹 Yesterday's Sales & Bills
      const yesterdayBillsList = bills.filter((bill) => {
        const billDate = new Date(bill.dateTime);
        return billDate >= yesterdayStart && billDate < todayStart;
      });
      const yesterdayTotal = yesterdayBillsList.reduce(
        (sum, bill) => sum + bill.totalPayableAmount,
        0
      );

      // ✅ Update states
      setTotalSales(total.toFixed(2));
      setMonthlySales(monthlyTotal.toFixed(2));
      setTodaySales(todayTotal.toFixed(2));
      setYesterdaySales(yesterdayTotal.toFixed(2));

      setTotalBills(totalBillCount);
      setMonthlyBills(monthlyBillsList.length);
      setTodayBills(todayBillsList.length);
      setYesterdayBills(yesterdayBillsList.length);
    };

    calculateStats();
  }, [bills]); // Runs when `bills` change

  const [loading, setLoading] = useState(true);

  const handleFindAllBills = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:7000/pharmacy/bills/find-all",
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status === 200 || status === 302,
        }
      );

      const sortedBills = response.data?.data
        ? response.data.data.sort(
            (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
          )
        : [];

      setBills(sortedBills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const avgSalesPerBill =
    totalBills > 0 ? (totalSales / totalBills).toFixed(2) : 0;
  const highestBill =
    bills.length > 0
      ? Math.max(...bills.map((bill) => bill.totalPayableAmount))
      : 0;
  const lowestBill =
    bills.length > 0
      ? Math.min(...bills.map((bill) => bill.totalPayableAmount))
      : 0;
  const paymentModes = {};
  bills.forEach((bill) => {
    paymentModes[bill.paymentMode] = (paymentModes[bill.paymentMode] || 0) + 1;
  });
  const mostUsedPaymentMode = Object.entries(paymentModes).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0];
  const patientCount = {};
  bills.forEach((bill) => {
    patientCount[bill.patientResponse.name] =
      (patientCount[bill.patientResponse.name] || 0) + 1;
  });
  const mostFrequentPatient = Object.entries(patientCount).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0];
  const salesGrowth =
    yesterdaySales > 0
      ? (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2)
      : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // 🔹 Get the current page's bills using slice()
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

  // 🔹 Change page
  const totalPages = Math.ceil(bills.length / billsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        margin: "1rem 4.5rem",
        display: "flex",
        gap: "1rem",
        paddingBottom: "2rem",
      }}
    >
      <div style={{ flexBasis: "3%", display: "flex", alignItems: "center" }}>
        <h2 className="headers">TRANSACTION HISTORY</h2>
      </div>
      {/* Bills Container */}
      <div
        style={{
          display: "flex",
          flexBasis: "62%",
          flexDirection: "column",
          justifyContent:"space-between"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading bills...</p>
          ) : bills.length === 0 ? (
            <p style={{ textAlign: "center" }}>No transactions found.</p>
          ) : (
            currentBills.map((bill) => (
              <div
                key={bill.billId}
                style={{
                  width: "100%",
                  border: "1px dashed rgb(0, 110, 255)",
                  padding: "1rem",
                  borderRadius: "10px",
                  background: "rgb(255, 255, 255, 0.5)",
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
                        <td>||</td>
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
                      PRINT &nbsp;
                      <i className="fa-solid fa-file-arrow-down"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {bills.length !== 0 ? (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "contained" : "outlined"}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="contained"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Sticky Bar Container */}
      <div
        className="sticky-bar"
        style={{
          flexBasis: "38%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          className="box"
          style={{
            background: "rgb(255, 255, 255, 0.5)",
            border: "1px dashed rgb(0, 110, 255)",
            borderRadius: "10px",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 className="headers">BILLS</h2>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Total</h4>
              <h2>{totalBills}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>This Month</h4>
              <h2>{monthlyBills}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Yesterday </h4>
              <h2>{yesterdayBills}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Today </h4>
              <h2>{todayBills}</h2>
            </div>
          </div>
        </div>
        <div
          className="box"
          style={{
            background: "rgb(255, 255, 255, 0.5)",
            border: "1px dashed rgb(0, 110, 255)",
            borderRadius: "10px",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 className="headers">SALES</h2>
          <div
            style={{
              display: "flex",
              gap: "1rem 2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Over All Sales</h4>
              <h2> {formatCurrency(totalSales)}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>This Month</h4>
              <h2>{formatCurrency(monthlySales)}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Yesterday </h4>
              <h2>{formatCurrency(yesterdaySales)}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Today </h4>
              <h2>{formatCurrency(todaySales)}</h2>
            </div>
          </div>
        </div>
        <div
          className="box"
          style={{
            background: "rgb(255, 255, 255, 0.5)",
            border: "1px dashed rgb(0, 110, 255)",
            borderRadius: "10px",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 className="headers">ADDITIONAL STATS</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Avg Sales per Bill</h4>
              <h2>{formatCurrency(avgSalesPerBill)}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Highest Bill</h4>
              <h2>{formatCurrency(highestBill)}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Lowest Bill</h4>
              <h2>{formatCurrency(parseFloat(lowestBill).toFixed(2))}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Most Used Payment</h4>
              <h2>{mostUsedPaymentMode}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Top Customer</h4>
              <h2>{mostFrequentPatient}</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Sales Growth</h4>
              <h2>{salesGrowth} %</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
