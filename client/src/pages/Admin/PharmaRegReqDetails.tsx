import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Card, Col, Row, Spin, message } from "antd";
import { config, headers } from "../../middleware/tokenMiddleware";
import FolderIcon from "@mui/icons-material/Folder";
import {
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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
      const response = await api.post(
        `/acceptPharmacist/${id}`,
        {},
        { headers: headers }
      );
      console.log("Pharmacist accepted:", response.data);
      const updatedRegistrationDetails = { ...registrationDetails };
      updatedRegistrationDetails.accepted = true;
      setRegistrationDetails(updatedRegistrationDetails);
      message.success("Registration Request Accepted!");
      setTimeout(() => {
        navigate("/admin/registrationRequests");
      }, 1000);
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
      setTimeout(() => {
        navigate("/admin/registrationRequests");
      }, 1000);
    } catch (error) {
      console.error("Error rejecting pharmacist:", error);
    }
  };

  const viewFiles = (filename: String) => {
    const pdfPath = `http://localhost:5000/uploads/${filename}`;

    window.open(pdfPath, "_blank");
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
                onClick={() => {
                  handleAcceptPharmacist(registrationDetails._id);
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
                onClick={() => {
                  handleRejectPharmacist(registrationDetails._id);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />

      <div style={{ justifyContent: "center" }}>
        <Row gutter={16}>
          <Col span={8}>
          <h5><b>Personal ID:</b></h5>
            <Card
              style={{
                display: "flex",
              }}
              hoverable
              onClick={() => viewFiles(registrationDetails.PersonalID.filename)}
            >
              <div
                style={{
                  display: "flex",
                  borderBottom: "0.5px solid #333",
                  paddingBottom: "10px",
                  // marginTop: 10,
                }}
              >
                <Avatar>
                  <FolderIcon />
                </Avatar>
                <div style={{ marginLeft: "20px", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p>
                        <strong>File Name: </strong>
                        {registrationDetails.PersonalID.originalname}
                      </p>
                      <p>
                        <strong>Type: </strong>
                        {registrationDetails.PersonalID.contentType ===
                        "application/octet-stream"
                          ? "PDF"
                          : registrationDetails.PersonalID.contentType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <h5>
              <b>Pharmacy Degree::</b>
            </h5>{" "}
            <Card
              style={{
                display: "flex",
              }}
              hoverable
              onClick={() =>
                viewFiles(registrationDetails.PharmacyDegree.filename)
              }
            >
              <div
                style={{
                  display: "flex",
                  borderBottom: "0.5px solid #333",
                  paddingBottom: "10px",
                  // marginTop: 10,
                }}
              >
                <Avatar>
                  <FolderIcon />
                </Avatar>
                <div style={{ marginLeft: "20px", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p>
                        <strong>File Name: </strong>
                        {registrationDetails.PharmacyDegree.originalname}
                      </p>
                      <p>
                        <strong>Type: </strong>
                        {registrationDetails.PharmacyDegree.contentType ===
                        "application/octet-stream"
                          ? "PDF"
                          : registrationDetails.PharmacyDegree.contentType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <br />
        <br />

        <h5>
          <b>Working Licenses:</b>
        </h5>
        <Row gutter={16}>
          {registrationDetails.WorkingLicenses.map((file: any) => (
            <Col span={8}>
              <Card
                style={{
                  display: "flex",
                }}
                hoverable
                onClick={() => viewFiles(file.filename)}
              >
                <div
                  style={{
                    display: "flex",
                    borderBottom: "0.5px solid #333",
                    paddingBottom: "10px",
                    // marginTop: 10,
                  }}
                >
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                  <div style={{ marginLeft: "20px", flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        lineHeight: "1",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p>
                          <strong>File Name: </strong>
                          {file.originalname}
                        </p>
                        <p>
                          <strong>Type: </strong>
                          {file.contentType === "application/octet-stream"
                            ? "PDF"
                            : file.contentType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default RegistrationRequestDetails;
