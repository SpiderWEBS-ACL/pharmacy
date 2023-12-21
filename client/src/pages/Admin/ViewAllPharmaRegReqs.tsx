import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { config, headers } from "../../middleware/tokenMiddleware";

const AllPharmaRequests = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:5000/admin",
  });

  const handleAcceptPharmacist = async (id: string) => {
    try {
      const response = await api.post(`/acceptPharmacist/${id}`, {},{headers:headers});
      console.log("Pharmacist accepted:", response.data);
      setDoctors((prevDoctors) => prevDoctors.filter(doctor => doctor._id !== id));
    } catch (error) {
      console.error("Error accepting pharmacist:", error);
    }
  };
  
  const handleRejectPharmacist = async (id: string) => {
    try {
      const response = await api.delete(`/rejectPharmacist/${id}`, config);
      console.log("Pharmacist rejected:", response.data);
      setDoctors((prevDoctors) => prevDoctors.filter(doctor => doctor._id !== id));
    } catch (error) {
      console.error("Error rejecting pharmacist:", error);
    }
  };
  
  

  useEffect(() => {
    api
      .get("/registrationRequests", config)
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/admin/registrationRequestDetails/" + id);
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
                  onClick={() => handleAcceptPharmacist(request._id)}
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
                  onClick={() => handleRejectPharmacist(request._id)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
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

export default AllPharmaRequests;
