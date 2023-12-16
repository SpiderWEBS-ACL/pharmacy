import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Layout, message, Button } from "antd";
import {
  IoAlertCircle,
  IoCheckmarkDoneCircleSharp,
  IoClose,
} from "react-icons/io5";
import Cookies from "js-cookie";
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCol, MDBRow, MDBInput } from 'mdb-react-ui-kit';

const Register: React.FC = () => {
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>("");
  const [Dob, setDob] = useState<string>("");
  const [Mobile, setMobile] = useState<string>("");
  const [EmergencyContactName, setEmergencyContactName] = useState<string>("");
  const [EmergencyContactMobile, setEmergencyContactMobile] = useState<string>("");
  const [EmergencyContactRelation, setEmergencyContactRelation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const handleSignUp = async () => {
    // Placeholder validation, replace with your actual validation logic
    if (!Name || !Email || !Password || !Username || !Gender || !Dob || !Mobile) {
      message.error("Please Fill In All Requirements");
      return;
    }

    try {
      // Your sign-up logic here
      const data = {
        Name,
        Email,
        Password,
        Username,
        Dob,
        Gender,
        Mobile,
        EmergencyContact: {
          Name: EmergencyContactName,
          Mobile: EmergencyContactMobile,
          relationToPatient: EmergencyContactRelation,
        },
      };

      const response = await api.post(`/patient/register`, data);
      console.log("Response:", response.data);
      message.success("Congrats, you are in!");
    } catch (error: any) {
      console.error("Error:", error);
      message.error(`${error.response.data.error}`);
    }
  };

  const handleSignIn = async () => {
    // Placeholder validation, replace with your actual validation logic
    if (!Username || !Password) {
      message.warning("Please Fill In All Fields");
      return;
    }

    try {
      // Your sign-in logic here
      const data = {
        Username,
        Password,
      };
      const response = await api.post(`/login`, data);
      console.log(response.data);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("type", response.data.type);
      Cookies.set("accessToken", response.data.accessToken);

      handleRedirection(response.data);
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error);
      message.error(`${error.response.data.error}`);
    }
  };

  const handleRegisterPharmacist = () => {
    navigate("/pharmacist/register");
    window.location.reload();
  };

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`/regLog`);
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Assuming the input format is "YYYY-MM-DD"
    // Placeholder validation, replace with your actual validation logic
    if (inputValue.trim() === "") {
      setError("Date of Birth is required");
    } else {
      setError(null);
    }
    setDob(inputValue);
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          {/* Left Column */}
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <img src="/monanurse.jpeg" alt="ren" width='400vh' style={{marginLeft: '60px'}} />
          </div>
        </MDBCol>
        <MDBCol col='6' className="mb-5">
          {/* Right Column */}
          <div className="d-flex flex-column ms-4" style={{ width: '80%' }}>
            <div className="text-center">
              <img src="/logo.png" style={{ width: '90px' }} alt="logo" />
            </div>
            <h3 style={{ alignSelf: "center" }}>Time to feel like home</h3>
            <br />

            {/* Input Fields */}
            <div className="d-flex flex-row flex-wrap">
              <div className="mb-3 w-50 pe-2">
                <label htmlFor='name' className="form-label" style={{ fontSize: '14px' }}>Name</label>
                <MDBInput id='name' type='text' onBlur={() => handleBlur('name')} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3 w-50">
                <label htmlFor='email' className="form-label" style={{ fontSize: '14px' }}>Email</label>
                <MDBInput id='email' type='email' onBlur={() => handleBlur('email')} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label htmlFor='password' className="form-label" style={{ fontSize: '14px' }}>Password</label>
                <MDBInput id='password' type='password' onBlur={() => handleBlur('password')} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-3 w-50">
                <label htmlFor='username' className="form-label" style={{ fontSize: '14px' }}>Username</label>
                <MDBInput id='username' type='text' onBlur={() => handleBlur('username')} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label htmlFor='gender' className="form-label" style={{ fontSize: '14px' }}>Gender</label>
                <MDBInput id='gender' type='text' onBlur={() => handleBlur('gender')} onChange={(e) => setGender(e.target.value)} />
              </div>
              <div className="mb-3 w-50">
                <label htmlFor='dob' className="form-label" style={{ fontSize: '14px' }}>Date of Birth</label>
                <MDBInput id='dob' type='date' onBlur={() => handleBlur('dob')} onChange={handleDobChange} />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label htmlFor='mobile' className="form-label" style={{ fontSize: '14px' }}>Mobile</label>
                <MDBInput id='mobile' type='text' onBlur={() => handleBlur('mobile')} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div className="mb-3 w-50">
                <label htmlFor='emergencyContactName' className="form-label" style={{ fontSize: '14px' }}>Emergency Contact Name</label>
                <MDBInput id='emergencyContactName' type='text' onBlur={() => handleBlur('emergencyContactName')} onChange={(e) => setEmergencyContactName(e.target.value)} />
              </div>
              <div className="mb-3 w-50 pe-2">
                <label htmlFor='emergencyContactMobile' className="form-label" style={{ fontSize: '14px' }}>Emergency Contact Mobile</label>
                <MDBInput id='emergencyContactMobile' type='text' onBlur={() => handleBlur('emergencyContactMobile')} onChange={(e) => setEmergencyContactMobile(e.target.value)} />
              </div>
              <div className="mb-3 w-50">
                <label htmlFor='emergencyContactRelation' className="form-label" style={{ fontSize: '14px' }}>Emergency Contact Relation</label>
                <MDBInput id='emergencyContactRelation' type='text' onBlur={() => handleBlur('emergencyContactRelation')} onChange={(e) => setEmergencyContactRelation(e.target.value)} />
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center pt-1 mb-1 pb-1">
              <Button className="mb-3 w-100" onClick={handleSignUp} type="primary">
                Register
              </Button>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-3 mb-3">
              <p className="mb-0">Pharmacist?</p>
              <Button type="dashed" danger style={{ marginLeft: '10px' }} onClick={handleRegisterPharmacist}>
                Register as Pharmacist
              </Button>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;