const express = require("express");
require("dotenv").config(); // Make sure this is loaded before db.js
const app = express();
app.use(express.json()); // Built-in middleware for JSON parsing
const cors = require("cors");
const pool = require("./db"); // Correct import for mysql2/promise

app.use((req, res, next) => {
  console.log("Request body:", req.body);
  next();
});

app.use(cors());

// GET all employee records
app.get("/api/employees", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dummyEmp");
    console.log(rows);

    res.status(200).json({
      success: true,
      empData: rows,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      empData: "Server error, Try again",
      error: error.message,
    });
  }
});
// GET employee record by id
app.get("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    // Use parameterized query with ? placeholder in MySQL2
    const [rows] = await pool.query(
      "SELECT * FROM dummyEmp WHERE EmployeeID = ?",
      [id]
    );
    console.log(rows);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee details not found",
      });
    }

    res.status(200).json({
      success: true,
      empData: rows[0],
    });
  } catch (error) {
    console.error("Error fetching employee by id:", error);
    res.status(500).json({
      success: false,
      empData: "Server error, Try again",
      error: error.message,
    });
  }
});

// Add new employee
app.post("/api/employees", async (req, res) => {
  try {
    const { EmployeeName, MobileNumber, Department, Salary } = req.body;
    console.log(req.body);

    // Check if any required field is missing
    if (!EmployeeName || !MobileNumber || !Department || !Salary) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Use parameterized INSERT query
    const [result] = await pool.query(
      "INSERT INTO dummyEmp (EmployeeName, MobileNumber, Department, Salary) VALUES (?, ?, ?, ?)",
      [EmployeeName, MobileNumber, Department, Salary]
    );

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).json({
      success: false,
      message: "Server error, Try again",
      error: error.message,
    });
  }
});
// update employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { EmployeeName, MobileNumber, Department, Salary } = req.body;

    // Check if any required field is missing
    if (!EmployeeName || !MobileNumber || !Department || !Salary) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Use parameterized INSERT query
    const [result] = await pool.query(
      "UPDATE dummyEmp SET EmployeeName=?, MobileNumber=?, Department=?, Salary=? WHERE EmployeeID=?",
      [EmployeeName, MobileNumber, Department, Salary, id]
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).json({
      success: false,
      message: "Server error, Try again",
      error: error.message,
    });
  }
});

// DELETE employee record by id
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    // Use parameterized query with ? placeholder in MySQL2
    const [result] = await pool.query(
      "DELETE FROM dummyEmp WHERE EmployeeID = ?",
      [id]
    );
    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting employee by id:", error);
    res.status(500).json({
      success: false,
      message: "Server error, Try again",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
