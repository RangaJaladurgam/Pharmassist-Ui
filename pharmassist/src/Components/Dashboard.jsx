import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import FloatingUploadForm from "./FloatingUploadForm";
import FloatingPatientForm from "./FloatingPatientForm";
import { green } from "@mui/material/colors";

function Dashboard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searched, setSearched] = useState(false);
  const [custPhoneNumber, setCustPhoneNumber] = useState("");
  const [patientFound, setPatientFound] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPharmacyForm, setShowPharmacyForm] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "",
  });
  const [addPatient, setAddPatient] = useState("");
  const [billCreated, setBillCreated] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [cash, setCash] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [billCompleted, setBillCompleted] = useState(false);
  const [billPrinted, setBillPrinted] = useState(false);
  const [isPharmacyPresent, setIsPharmacyPresent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const adminResponse = await axios.get(
          "http://localhost:7000/admins/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) => status == 200 || 302
          }
        );

        localStorage.setItem("admin", JSON.stringify(adminResponse.data.data));
        setIsPharmacyPresent(!!adminResponse.data.data.pharmacyResponse);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

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

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleResetCart = () => {
    localStorage.removeItem("cartList");
    localStorage.removeItem("patientId");
    localStorage.removeItem("patientBillId");
    setCartList([]); // Clear the state as well
    setBillCreated(false);
  };

  const handleSearchPatient = async (e) => {
    if (!isPharmacyPresent) return;
    e.preventDefault();
    setSearched(true);
    const token = localStorage.getItem("token");
    if (custPhoneNumber.length === 10) {
      try {
        const response = await axios.get(
          "http://localhost:7000/patients/" + custPhoneNumber,
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: (status) =>
              status === 200 || status === 302 || status === 404,
          }
        );
        console.log(response.data);

        if (response.status !== 404) {
          const patient = response.data.data;
          setPatientFound(true);
          setCustomer({
            name: patient.name,
            phoneNumber: custPhoneNumber,
            email: patient.email,
            gender: patient.gender,
          });
          localStorage.setItem("patientId", response.data.data.patientId);
          localStorage.setItem("PatientPhoneNumber", custPhoneNumber);
        } else {
          setCustomer({});
          setPatientFound(false);
          localStorage.removeItem("patientId");
          localStorage.removeItem("PatientPhoneNumber");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCreateBill = async () => {
    if (billCreated) return; // Prevent multiple requests
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:7000/bills/create",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { phoneNumber: custPhoneNumber },
          validateStatus: (status) => status === 200 || status === 201,
        }
      );
      const billId = response.data.data.billId;
      localStorage.setItem("patientBillId", billId);
      for (const item of cartList) {
        try {
          const responseBag = await axios.post(
            "http://localhost:7000/bills/" + billId + "/add-item",
            null,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                medicineId: item.medicineId,
                quantity: item.quantity,
              },
              validateStatus: (status) => status === 200 || status === 201,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      setBillCreated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteBill = async () => {
    if (billCompleted) return;
    const token = localStorage.getItem("token");
    const billId = localStorage.getItem("patientBillId");
    try {
      const response = await axios.post(
        "http://localhost:7000/bills/" + billId,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { paymentMode: paymentMode },
          validateStatus: (status) => status === 200 || status === 404,
        }
      );
      setBillCompleted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrintBill = async () => {
    const token = localStorage.getItem("token");
    const billId = localStorage.getItem("patientBillId");

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return !isPharmacyPresent ? (
    <div
      style={{
        height: "80vh",
        padding: "0.5rem 4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <>
        <h1>Pharmacy Is Not Linked Yet...</h1>
        <p>
          Click on{" "}
          <span
            style={{
              color: "red",
              textDecoration: "underline",
            }}
          >
            Link Pharmacy
          </span>{" "}
          on the DashMenu
        </p>
      </>
    </div>
  ) : (
    <div
      style={{
        padding: "0.5rem 4rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div className="dashboard-container">
        <div className="dashboard-left-container">
          <div className="left-inner scroll-bar">
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <Button
                variant="text"
                disabled
                style={{
                  height: "28px",
                  width: "100%",
                  color: "rgb(0, 110, 255)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <i className="fa-solid fa-hospital"></i>
                <i className="fa-solid fa-pills"></i>
                <i className="fa-solid fa-syringe"></i>
                <i className="fa-solid fa-cart-shopping"></i>
                <span>CART</span>
                <i className="fa-solid fa-cart-shopping"></i>
                <i className="fa-solid fa-capsules"></i>
                <i className="fa-solid fa-stethoscope"></i>
                <i className="fa-solid fa-hospital"></i>
              </Button>
            </div>
            <div className="medicine-table scroll-bar">
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
                      <td style={{ textAlign: "center" }}>
                        {formatCurrency(parseFloat(medicine.price.toFixed(2)))}
                      </td>
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
                          slotprops={{ min: 1, max: medicine.stockQuantity }}
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
                        {formatCurrency(
                          parseFloat(
                            (medicine.price * medicine.quantity).toFixed(2)
                          )
                        )}
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
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          paddingBlock: "1rem",
                          fontSize: "14px",
                          border: "none",
                        }}
                      >
                        Empty Cart
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {cartList.length > 0 && (
                <>
                  <Button
                    variant="text"
                    disabled
                    style={{
                      height: "28px",
                      color: "black",
                      display: "flex",
                    }}
                  >
                    ITEMS : {cartList.length}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{
                      height: "28px",
                      width: "7rem",
                    }}
                    onClick={handleResetCart}
                  >
                    Clear &nbsp;<i className="fa-solid fa-trash"></i>
                  </Button>
                </>
              )}
              {cartList.length > 0 && (
                <Button
                  variant="text"
                  disabled
                  style={{
                    height: "28px",
                    color: "black",
                    display: "flex",
                  }}
                >
                  Total :{" "}
                  {formatCurrency(parseFloat(totalCartValue.toFixed(2)))}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-right-container">
          <div className="right-inner">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                style={{
                  padding: "0.2rem 0.5rem",
                  width: "70%",
                  border: "1px dashed rgb(0, 110, 255)",
                }}
                type="text"
                placeholder="Search Medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="text"
                style={{
                  height: "29px",
                  width: "28%",
                  backgroundColor: "rgb(0, 110, 255)",
                  color: "white",
                }}
                onClick={handleUploadClick}
              >
                UPLOAD &nbsp;<i className="fa-solid fa-cloud-arrow-up"></i>
              </Button>
            </div>

            <div className="medicine-table scroll-bar">
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
                      <td>
                        {formatCurrency(parseFloat(medicine.price.toFixed(2)))}
                      </td>
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
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          paddingBlock: "1rem",
                          border: "none",
                        }}
                      >
                        No Medicines Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-lower-container ">
        <div className="dashboard-lower">
          <div>
            <form
              onSubmit={handleSearchPatient}
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                style={{
                  padding: "0.2rem 0.5rem",
                  width: "70%",
                  border: "1px dashed blue",
                }}
                type="text" // Change type to text to control input better
                placeholder="Enter Phone Number"
                value={custPhoneNumber}
                minLength={10}
                maxLength={10} // Restricts to 10 characters
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Allow only digits
                  if (value.length <= 10) {
                    setCustPhoneNumber(value);
                  }
                }}
              />
              <Button
                variant="text"
                type="submit"
                style={{
                  height: "29px",
                  width: "28%",
                  backgroundColor: "rgb(0, 110, 255)",
                  color: "white",
                }}
              >
                Search &nbsp;<i className="fa-solid fa-search"></i>
              </Button>
            </form>
          </div>
          <div style={{ overflow: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingInline: "0.5rem",
              }}
            >
              <p style={{ textDecoration: "underline" }}>PATIENT DETAILS :</p>
              {searched ? (
                <span style={{ color: patientFound ? "green" : "red" }}>
                  {patientFound ? (
                    <>
                      FOUND <i className="fa-solid fa-face-smile-wink"></i>
                    </>
                  ) : (
                    <>
                      NOT FOUND <i className="fa-solid fa-face-sad-tear"></i>
                    </>
                  )}
                </span>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: !patientFound ? "center" : "start",
              }}
            >
              {searched ? (
                !patientFound ? (
                  <>
                    <Button
                      onClick={() => setShowForm(true)}
                      style={{
                        height: "30px",
                        width: "100%",
                        marginTop: "0.5rem",
                        backgroundColor: "rgb(0, 110, 255)",
                        color: "white",
                      }}
                    >
                      ADD PATIENT
                    </Button>
                    <p>{addPatient}</p>
                  </>
                ) : (
                  <table>
                    <tbody>
                      <tr>
                        <td>NAME </td>
                        <td>:</td>
                        <td>
                          {patientFound
                            ? customer.name.charAt(0).toUpperCase() +
                              customer.name.slice(1)
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td>PHONE </td>
                        <td>:</td>
                        <td>{customer.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td>EMAIL </td>
                        <td>:</td>
                        <td>{customer.email}</td>
                      </tr>
                      <tr>
                        <td>GENDER </td>
                        <td>:</td>
                        <td>{customer.gender}</td>
                      </tr>
                    </tbody>
                  </table>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="dashboard-lower">
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px dashed rgb(12, 154, 64)" }}>
                <p style={{ textAlign: "center" }}>CART VALUE</p>
              </div>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>TOTAL PRICE</td>
                    <td> : </td>
                    <td>
                      {formatCurrency(parseFloat(totalCartValue.toFixed(2)))}
                    </td>
                  </tr>
                  <tr>
                    <td>GST (18%)</td>
                    <td>:</td>
                    <td>
                      {formatCurrency(
                        parseFloat(
                          (parseFloat(totalCartValue.toFixed(2)) / 100) * 18.0
                        ).toFixed(2)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>PAYABLE AMOUNT</td>
                    <td>:</td>
                    <td>
                      {formatCurrency(
                        parseFloat(
                          totalCartValue +
                            (parseFloat(totalCartValue.toFixed(2)) / 100) * 18.0
                        ).toFixed(2)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <Button
              onClick={handleCreateBill}
              disabled={!(searched && patientFound && totalCartValue > 0)}
              style={{
                width: "100%",
                backgroundColor: billCreated
                  ? "green"
                  : searched && patientFound && totalCartValue > 0
                  ? "rgb(0, 110, 255)"
                  : "gray",
                color: "white",
                cursor:
                  billCreated ||
                  (searched && patientFound && totalCartValue > 0)
                    ? "pointer"
                    : "not-allowed",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {billCreated ? (
                <>
                  Bill Created &nbsp; <i className="fa-solid fa-check"></i>
                </>
              ) : (
                "Create Bill"
              )}
            </Button>
          </div>
        </div>
        <div className="dashboard-lower">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              select
              fullWidth
              size="small"
              disabled={!billCreated}
              label="Payment Mode"
              variant="outlined"
              name="payment"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <MenuItem value="CASH">CASH</MenuItem>
              <MenuItem value="CARD">CARD</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
            </TextField>
            {paymentMode === "" && (
              <div
                className="payment-upi"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <p>Choose Payment to proceed</p>
              </div>
            )}
          </div>
          <div>
            {paymentMode === "CASH" && (
              <div
                className="payment-cash"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Cash given"
                  variant="outlined"
                  name="cash"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  onClick={() => setPaymentDone(true)}
                ></TextField>
                <TextField
                  fullWidth
                  size="small"
                  label="return change"
                  variant="outlined"
                  name="cash"
                  value={
                    cash
                      ? parseFloat(
                          cash -
                            parseFloat(
                              totalCartValue +
                                (parseFloat(totalCartValue.toFixed(2)) / 100) *
                                  18.0
                            ).toFixed(2)
                        ).toFixed(0)
                      : ""
                  }
                ></TextField>
              </div>
            )}
            {paymentMode === "CARD" && (
              <div
                className="payment-cash"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => setPaymentDone(true)}
                  style={{
                    height: "100%",
                    backgroundColor: paymentDone ? "green" : "rgb(102, 0, 255)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {paymentDone ? (
                    <>
                      {" "}
                      Payment Successfull &nbsp;{" "}
                      <i className="fa-solid fa-check"></i>{" "}
                    </>
                  ) : (
                    "Proceed to Card Payment"
                  )}
                </Button>
              </div>
            )}
            {paymentMode === "UPI" && (
              <div
                className="payment-upi"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <Button
                  fullWidth
                  onClick={() => setPaymentDone(true)}
                  style={{
                    height: "100%",
                    backgroundColor: paymentDone ? "green" : "rgb(102, 0, 255)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  {paymentDone ? (
                    <>
                      {" "}
                      Payment Successfull &nbsp;
                      <i className="fa-solid fa-check"></i>{" "}
                    </>
                  ) : (
                    "Proceed to UPI Payment"
                  )}
                </Button>
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleCompleteBill}
                disabled={!paymentDone}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: billCompleted
                    ? "green"
                    : paymentDone
                    ? "rgb(0, 110, 255)"
                    : "gray",
                  color: "white",
                  cursor: paymentDone ? "pointer" : "not-allowed",
                  border: "none",
                  borderRadius: "5px",
                  flexBasis: "50%",
                }}
              >
                {billCompleted ? (
                  <>
                    {" "}
                    Bill Completed &nbsp;<i className="fa-solid fa-check"></i>{" "}
                  </>
                ) : (
                  "Complete Bill"
                )}
              </Button>
              <Button
                onClick={handlePrintBill}
                disabled={!billCompleted}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: billPrinted
                    ? "green"
                    : billCompleted
                    ? "rgb(0, 110, 255)"
                    : "gray",
                  color: "white",
                  cursor: billCompleted ? "pointer" : "not-allowed",
                  border: "none",
                  borderRadius: "5px",
                  flexBasis: "50%",
                }}
              >
                {billPrinted ? (
                  <>
                    {" "}
                    Bill Printed &nbsp;<i className="fa-solid fa-check"></i>{" "}
                  </>
                ) : (
                  "Print Bill"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Form Component */}
      {showForm && (
        <FloatingPatientForm
          custPhoneNumber={custPhoneNumber}
          setAddPatient={setAddPatient}
          closeForm={() => setShowForm(false)}
        />
      )}
      {showPharmacyForm && (
        <FloatingForm
          showForm={showPharmacyForm}
          setShowForm={setShowPharmacyForm}
        />
      )}

      {/* Floating Upload Form */}
      {showUploadForm && (
        <FloatingUploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </div>
  );
}

export default Dashboard;
