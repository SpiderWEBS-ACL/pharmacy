import React, { useState, useEffect, ChangeEvent } from "react";
import "../../layouts/footer.css"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { config, headers } from "../../middleware/tokenMiddleware";
import { Button, Card, Col, Row, message } from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { green } from "@mui/material/colors";
import { Avatar } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import { Layout } from "antd";
const { Header } = Layout;
// import { Document, Page } from 'react-pdf';

import { Buffer } from "buffer";

export interface JwtPayload {
  id: string;
  role: string;
}

const UploadDocuments = () => {
  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const currentUrl = window.location.href;
  var id = currentUrl.split("/")[4];

  const accessToken = Cookies.get("accessToken");

  let pharmID = "";

  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    pharmID = decodedToken.role as string;
  }

  type FileObj = {
    filename: string;
    originalname: string;
    path: string;
    contentType: string;
  };

  const [loading, setLoading] = useState(true);
  const [activeTabKey1, setActiveTabKey1] = useState<string>("tab1");
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [idUpload, setIDUpload] = useState<File>();
  const [degreeUp, setDegreeUp] = useState<File>();
  const [personalID, setPersonalID] = useState<FileObj>();
  const [degree, setDegree] = useState<FileObj>();
  const [licenses, setLicenses] = useState<any[]>([]);

  const navigate = useNavigate();

  const tabList = [
    {
      key: "tab1",
      tab: "Personal ID",
    },
    {
      key: "tab2",
      tab: "Pharmacy Degree",
    },
    {
      key: "tab3",
      tab: "Working Licenses",
    },
  ];

  useEffect(() => {
    // if(pharmID != "")
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      const response = await api.get(
        `/pharmacist/registrationRequestDetails/${id}`,
        config
      );
      if (response.data) {
        setPersonalID(response.data.PersonalID);
        setDegree(response.data.PharmacyDegree);
        setLicenses(response.data.WorkingLicenses);
        console.log(response.data);
        setLoading(false);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error("An error occurred while fetching files: ");
      console.error(error);
    }
  };

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);

    setLoading(true);
    getFiles();
  };

  const viewFiles = (filename: String) => {
    const pdfPath = `http://localhost:5000/uploads/${filename}`;

    window.open(pdfPath, "_blank");
  };

  const uploadID = async () => {
    if (!idUpload) {
      message.error("Please select file(s) to upload!");
      return;
    }

    const formData = new FormData();

    formData.append("file", idUpload);

    try {
      const response = await api.post(
        `/pharmacist/uploadPersonalID/${id}`,
        formData
      );
      message.success("File(s) uploaded successfully!");
      //   getFiles();
      setPersonalID(response.data);

      console.log(response);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const uploadDegree = async () => {
    if (!degreeUp) {
      message.error("Please select file(s) to upload!");
      return;
    }

    const formData = new FormData();

    formData.append("file", degreeUp);

    try {
      const response = await api.post(
        `/pharmacist/uploadDegree/${id}`,
        formData
      );
      message.success("File(s) uploaded successfully!");
      //   getFiles();
      setDegree(response.data);

      console.log(response);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const uploadLicenses = async () => {
    if (selectedFiles) {
      const formData = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        formData.append("files", file);
        formData.append("filename", file.name);
        formData.append("originalname", file.name);
        formData.append("contentType", file.type);
      }

      try {
        const response = await api.post(
          `/pharmacist/uploadLicenses/${id}`,
          formData
        );
        message.success("File(s) uploaded successfully!");
        getFiles();

        console.log(response);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    } else {
      message.error("Please select file(s) to upload!");
    }
  };

  const handleSubmit = async() => {
    if(!personalID || !degree || licenses.length == 0){
        message.error("Please upload all required documents");
        return;
    }

    message.success("Documents Submitted! Please wait while one of our admins reviews your application");
  
    setTimeout(() => {
        navigate('/');
        window.location.reload();
    }, 2000);
  }

  const contentList: Record<string, React.ReactNode> = {
    tab1: (
      <p>
        {personalID && (
          <div
            style={{
              display: "flex",
              borderBottom: "0.5px solid #333",
              paddingBottom: "10px",
              marginTop: 20,
            }}
          >
            <Avatar>
              <FolderIcon />
            </Avatar>
            <div style={{ marginLeft: "20px", flex: 1 }}>
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "1.5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => viewFiles(personalID.filename)}
              >
                <div>
                  <p>
                    <strong>File Name: </strong>
                    {personalID.originalname}
                  </p>
                  <p>
                    <strong>Type: </strong>
                    {personalID.contentType === "application/octet-stream"
                      ? "PDF"
                      : personalID.contentType}
                  </p>
                </div>
                <div style={{ display: "flex" }}>
                  <DeleteOutlined
                    style={{ color: "#FF0000", marginRight: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <input
            type="file"
            accept=".pdf, .jpeg, .jpg, .png"
            onChange={(e: any) => {
              setIDUpload(e.target.files[0]);
            }}
          />

          <Button icon={<UploadOutlined />} onClick={uploadID}>
            Upload!
          </Button>
        </Row>
      </p>
    ),
    tab2: (
      <p>
        {degree && (
          <div
            style={{
              display: "flex",
              borderBottom: "0.5px solid #333",
              paddingBottom: "10px",
              marginTop: 20,
            }}
          >
            <Avatar>
              <FolderIcon />
            </Avatar>
            <div style={{ marginLeft: "20px", flex: 1 }}>
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "1.5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => viewFiles(degree.filename)}
              >
                <div>
                  <p>
                    <strong>File Name: </strong>
                    {degree.originalname}
                  </p>
                  <p>
                    <strong>Type: </strong>
                    {degree.contentType === "application/octet-stream"
                      ? "PDF"
                      : degree.contentType}
                  </p>
                </div>
                <div style={{ display: "flex" }}>
                  <DeleteOutlined
                    style={{ color: "#FF0000", marginRight: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <input
            type="file"
            accept=".pdf, .jpeg, .jpg, .png"
            onChange={(e: any) => {
              setDegreeUp(e.target.files[0]);
            }}
          />

          <Button icon={<UploadOutlined />} onClick={uploadDegree}>
            Upload!
          </Button>
        </Row>
      </p>
    ),
    tab3: (
      <p>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {licenses.map((file, index) => (
            <div
              style={{
                display: "flex",
                borderBottom: "0.5px solid #333",
                paddingBottom: "10px",
                marginTop: 20,
              }}
            >
              <Avatar>
                <FolderIcon />
              </Avatar>
              <div style={{ marginLeft: "20px", flex: 1 }}>
                <div
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.5",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={() => viewFiles(file.filename)}
                >
                  <div>
                    <p>
                      <strong>File Name: </strong>
                      {file.originalname}
                    </p>
                    <p>
                      <strong>Type: </strong>
                      {file.type === "application/octet-stream"
                        ? "PDF"
                        : file.contentType}
                    </p>
                  </div>
                  {/* <div style={{ display: "flex" }}>
                    <DeleteOutlined
                      style={{ color: "#FF0000", marginRight: 20 }}
                    />
                  </div> */}
                </div>
              </div>
            </div>
            
          ))}

        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <input
            type="file"
            accept=".pdf, .jpeg, .jpg, .png"
            onChange={(e: any) => {
              setSelectedFiles(e.target.files);
            }}
            multiple
          />

          <Button icon={<UploadOutlined />} onClick={uploadLicenses}>
            Upload!
          </Button>
        </Row>
        </div>
      </p>
    ),
  };

  return (
    <div>
    <div className="container">
      <Header
        style={{
          background: "transparent",
          height: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src="/logo.png" alt="logo" height={100} width={100} />
      </Header>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mt-4 mb-4">
            <strong>Upload Documents</strong>
          </h2>
          <Col style={{ display: "flex" }}>
            <Card
              tabList={tabList}
              style={{
                height: 400,
                width: 800,
                marginTop: 16,
                flexDirection: "row",
              }}
              loading={loading}
              hoverable
              className="hover-card"
              activeTabKey={activeTabKey1}
              onTabChange={onTab1Change}
            >
              {contentList[activeTabKey1]}
            </Card>
          </Col>
<br />
        <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-success"
              style={{ alignSelf: "flex-start", marginLeft: "auto" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="footer" style={{marginTop: "2%", paddingLeft: 30, width: "100%"}}>
      <p>Contact</p>
      <p>Socials</p>
      <p>Legal</p>
      <p>support@spiderwebs.com</p>
      <p>pharma_spiderwebs</p>
      <p>spiderwebs &copy; </p>
      <p>+9874544569 </p>
    </div>
    </div>
  );
};

export default UploadDocuments;
