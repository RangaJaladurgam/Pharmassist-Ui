import React, { useState } from "react";
import { Box, Button, Typography, Modal, Backdrop } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const FloatingUploadForm = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].name.endsWith(".xlsx")) {
      setFile(acceptedFiles[0]);
    } else {
      alert("Please upload a valid Excel file (.xlsx)");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:7000/pharmacy/medicines/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        
          validateStatus: (status) => status === 200 || status === 201,
      });
      alert("File uploaded successfully");
      onClose(); // Close the modal after upload
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Medicine File
        </Typography>

        {/* Drag & Drop Area */}
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: "8px",
            p: 3,
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f0f0" : "white",
            transition: "background-color 0.3s ease-in-out",
            mb: 2,
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1" color="textSecondary">
            {file ? file.name : "Drag & drop a .xlsx file here, or click to select one"}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FloatingUploadForm;
