import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "bootstrap/js/dist/modal";
import "./EmpCrud.css";

// Serialization helpers
const toPascalCase = (obj) => {
  const result = {};
  for (const key in obj) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = obj[key];
  }
  return result;
};

const toCamelCase = (obj) => {
  const result = {};
  for (const key in obj) {
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    result[camelKey] = obj[key];
  }
  return result;
};

const EmpCrud = () => {
  const [emp, setEmp] = useState([]);
  const [empData, setEmpData] = useState({
    employeeName: "",
    mobileNumber: "",
    department: "",
    salary: "",
  });

  const [editing, setEditing] = useState(false);
  const [empId, setEmpId] = useState(null);

  const API_URL = "http://localhost:8080/api/employees";

  // Fetch employees on mount
  useEffect(() => {
    fetchEmp();
  }, []);

  const fetchEmp = async () => {
    try {
      const response = await axios.get(API_URL);
      // Convert response data keys from PascalCase to camelCase
      const camelCaseEmp = response.data.empData.map((item) =>
        toCamelCase(item)
      );
      setEmp(camelCaseEmp);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const editEmp = async (EmployeeID) => {
    try {
      const response = await axios.get(`${API_URL}/${EmployeeID}`);
      // Convert to camelCase before setting state
      setEmpData(toCamelCase(response.data.empData));
      setEmpId(EmployeeID);
      setEditing(true);
    } catch (error) {
      console.error("Failed to fetch employee data", error);
    }
  };

  const deleteEmp = async (id) => {
    if (window.confirm("Are you sure to delete the employee data?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Employee deleted successfully");
        fetchEmp();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpData({ ...empData, [name]: value });
  };

  const handleAddAndUpdate = async () => {
    // Convert to PascalCase before sending to backend
    const transformedData = toPascalCase(empData);

    try {
      if (editing) {
        const response = await axios.put(
          `${API_URL}/${empId}`,
          transformedData
        );
        if (response.status === 200 || response.status === 204) {
          toast.success("Employee updated successfully");
        }
      } else {
        const response = await axios.post(API_URL, transformedData);
        if (response.status === 200 || response.status === 201) {
          toast.success("Employee added successfully");
        }
      }

      fetchEmp();
      setEditing(false);
      setEmpData({
        employeeName: "",
        mobileNumber: "",
        department: "",
        salary: "",
      });

      // Manually close modal
      const modalEl = document.getElementById("empModal");
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.hide();
    } catch (error) {
      console.error("Failed to save employee", error);
      const errorMsg = error.response?.data?.message || "Error saving employee";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#empModal"
        onClick={() => {
          setEditing(false);
          setEmpData({
            employeeName: "",
            mobileNumber: "",
            department: "",
            salary: "",
          });
        }}
      >
        ADD NEW EMPLOYEE
      </button>

      <h1>EMPLOYEE CRUD PROJECT</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>EMPLOYEE NAME</th>
            <th>MOBILE NO.</th>
            <th>DEPARTMENT</th>
            <th>SALARY</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {emp.map((empItem) => (
            <tr key={empItem.employeeID || empItem.EmployeeID}>
              <td>{empItem.employeeName}</td>
              <td>{empItem.mobileNumber}</td>
              <td>{empItem.department}</td>
              <td>{empItem.salary}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#empModal"
                  onClick={() =>
                    editEmp(empItem.employeeID || empItem.EmployeeID)
                  }
                >
                  EDIT
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    deleteEmp(empItem.employeeID || empItem.EmployeeID)
                  }
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <div
        className="modal fade"
        id="empModal"
        tabIndex="-1"
        aria-labelledby="empModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="empModalLabel">
                {editing ? "Edit Employee" : "Add Employee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                name="employeeName"
                value={empData.employeeName}
                onChange={handleInputChange}
                className="form-control mb-3"
                placeholder="Enter name"
              />

              <input
                type="text"
                name="mobileNumber"
                value={empData.mobileNumber}
                onChange={handleInputChange}
                className="form-control mb-3"
                placeholder="Enter mobile number"
              />

              <input
                type="text"
                name="department"
                value={empData.department}
                onChange={handleInputChange}
                className="form-control mb-3"
                placeholder="Enter department"
              />

              <input
                type="text"
                name="salary"
                value={empData.salary}
                onChange={handleInputChange}
                className="form-control mb-3"
                placeholder="Enter salary"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                CLOSE
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddAndUpdate}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpCrud;
