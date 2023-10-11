import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const AvailableMedicine = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = axios.create({
      baseURL: "http://localhost:5000/Pharmacist",
    });
  
    useEffect(() => {
      api
        .get("/medicine/viewMedicines")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, []);
  
    const navigate = useNavigate();
  
    const handleViewDetails = async (id: string) => {

    };
  
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
  
    return (
      <div className="container">
        <h2 className="text-center mt-4 mb-4">
          <strong>Pharmacists Registration Requests</strong>
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Accept</th>
              <th>Reject</th>
              <th>Details</th>
            </tr>
          </thead>
  
          <tbody>
            {doctors.map((request: any, index) => (
              <tr key={request._id}>
                <td>
                  <strong>{request.Name}</strong>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "5px",
                    }}
                  >
                    <span aria-hidden="true" style={{ color: "white" }}>
                      &#10003;
                    </span>
                  </button>
                </td>
  
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "5px",
                    }}
                    //TODO onClick in sprint 2 this is just a view
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewDetails(request._id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default AvailableMedicine;