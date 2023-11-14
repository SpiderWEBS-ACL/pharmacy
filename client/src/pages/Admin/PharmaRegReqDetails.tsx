import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spin, message } from "antd";
import { config, headers } from "../../middleware/tokenMiddleware";

const RegistrationRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [registrationDetails, setRegistrationDetails] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:5000/admin",
  });

  const navigate = useNavigate();

  const handleAcceptPharmacist = async (id: string) => {
    try {
      const response = await api.post(`/acceptPharmacist/${id}`,{},{headers:headers});
      console.log("Pharmacist accepted:", response.data);
      const updatedRegistrationDetails = { ...registrationDetails };
      updatedRegistrationDetails.accepted = true;
      setRegistrationDetails(updatedRegistrationDetails);
      message.success("Registration Request Accepted!");
      setTimeout(() =>{
        navigate("/admin/registrationRequests");
      }, 1000)
    } catch (error) {
      console.error("Error accepting pharmacist:", error);
    }
  };
  
  const handleRejectPharmacist = async (id: string) => {
    try {
      const response = await api.delete(`/rejectPharmacist/${id}`, config);
      console.log("Pharmacist rejected:", response.data);
      const updatedRegistrationDetails = { ...registrationDetails };
      updatedRegistrationDetails.rejected = true;
      setRegistrationDetails(updatedRegistrationDetails);
      message.success("Registration Request Rejected!");
      setTimeout(() =>{
        navigate("/admin/registrationRequests");
      }, 1000)
    } catch (error) {
      console.error("Error rejecting pharmacist:", error);
    }
  };

  useEffect(() => {
    api

      .get(`/registrationRequestDetails/${id}`, config)
      .then((response) => {
        setRegistrationDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  console.log(registrationDetails);

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
      <h2 className="text-center mt-4 mb-4">Registration Request Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dob</th>
            <th>HourlyRate</th>
            <th>Affiliation</th>
            <th>Education</th>
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>

        <tbody>
          <tr key={registrationDetails._id}>
            <td>{registrationDetails.Username}</td>
            <td>{registrationDetails.Name}</td>
            <td>{registrationDetails.Email}</td>
            <td>{registrationDetails.Dob}</td>
            <td>{registrationDetails.HourlyRate}</td>
            <td>{registrationDetails.Affiliation}</td>
            <td>{registrationDetails.EducationalBackground}</td>
            <td>
              <button
                className="btn btn-sm btn-success"
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                }}
                onClick={()=>{handleAcceptPharmacist(registrationDetails._id)}}
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
                onClick={()=>{handleRejectPharmacist(registrationDetails._id)}}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationRequestDetails;
