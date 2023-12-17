import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Layout, message, Button, Input, Select, DatePicker, Form } from "antd";
import {
  IoAlertCircle,
  IoCheckmarkDoneCircleSharp,
  IoClose,
} from "react-icons/io5";
import Cookies from "js-cookie";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
} from "mdb-react-ui-kit";
import dayjs from "dayjs";
import {
  validateEmail,
  validateMobile,
  validatePassword,
  validateUsername,
} from "../utils/ValidationUtils";

import InputField3 from "../components/InputField3";


const Register: React.FC = () => {
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>("");
  const [Dob, setDob] = useState<string>("");
  const [Mobile, setMobile] = useState<string>("");
  const [EmergencyContactName, setEmergencyContactName] = useState<string>("");
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<string>("");
  const [EmergencyContactRelation, setEmergencyContactRelation] =
    useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });
  const { Option } = Select;

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const handleSignUp = async () => {
    // Placeholder validation, replace with your actual validation logic
    if (
      !Name ||
      !Email ||
      !Password ||
      !Username ||
      !Gender ||
      !Dob ||
      !Mobile
    ) {
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
      navigate(`http://localhost:5173/reglog`);
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
    const inputValue = event.target.value;
    if (inputValue.trim() === "") {
      setError("Date of Birth is required");
    } else {
      setError(null);
    }
    setDob(inputValue);
  };

  const prefixSelector = (
    <Select style={{ width: 70 }}>
      <Option value="20">+20</Option>
    </Select>
  );

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          {/* Left Column */}
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <img src="/2.png" alt="ren" width="100%" />
          </div>
        </MDBCol>
        <MDBCol col="6" className="mb-5">
          {/* Right Column */}
          <div className="d-flex flex-column ms-4" style={{ width: "80%" }}>
            <div className="text-center">
              <img src="/logo.png" style={{ width: "90px" }} alt="logo" />
            </div>
            <h3 style={{ alignSelf: "center" }}>Time to feel like home</h3>
            <br />

            <Form>
            {/* Input Fields */}
            <div className="d-flex flex-row flex-wrap">
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="name"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Name
                </label>
                <Form.Item style={{margin: 0}}>
                  <Input
                    id="name"
                    type="text"
                    onBlur={() => handleBlur("name")}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>
                
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Email
                </label>
                <Form.Item style={{margin: 0}}
                 >
                <InputField3
                    id="email"
                    label="Email"
                    type="text"
                    value={Email}
                    onChange={setEmail}
                    onBlur={() => handleBlur("email")}
                    isValid={validateEmail(Email)}
                    errorMessage="Invalid Email"
                    required={true}
                />
                </Form.Item>
              </div>

              <div className="mb-3 w-50">
                <label
                  htmlFor="username"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Username
                </label>
                <Form.Item style={{margin: 0}}>
                <InputField3
                  id="Username"
                  label="Username"
                  type="text"
                  value={Username}
                  onChange={setUsername}
                  onBlur={() => handleBlur("username")}
                  isValid={validateUsername(Username)}
                  errorMessage="Username must be at least 3 characters long."
                  touched={touchedFields.username}
                  required={true}
                />
                </Form.Item>
              </div>

              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Password
                </label>
                <Form.Item style={{margin: 0}} >

                <InputField3
                  id="Password"
                  label="Password"
                  type="password"
                  value={Password}
                  onChange={setPassword}
                  onBlur={() => handleBlur("password")}
                  isValid={validatePassword(Password)}
                  errorMessage="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
                  touched={touchedFields.password}
                  required={true}
                />
                </Form.Item>
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="gender"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Gender
                </label>
                <Form.Item style={{margin: 0}}>
                  <InputField3
                    id = "gender"
                    type = "select"
                    onChange={setGender}
                    options={["Male", "Female"]}
                    value ={Gender}
                  >
                  </InputField3>
                </Form.Item>
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="dob"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Date of Birth
                </label>
                <Form.Item style={{margin: 0}}>
                <DatePicker
                  value={Dob ? dayjs(Dob) : undefined}
                  onChange={(date, dateString) => {
                    if (dateString) {
                      setDob(dateString);
                    }
                  }}
                  style={{ width: "100%" }}
                />
                </Form.Item>
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="mobile"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Mobile
                </label>

                <Form.Item style={{margin: 0}}>

                <InputField3
                  id="MobileNo"
                  label="Mobile Number"
                  type="tel"
                  value={Mobile !== undefined ? Mobile.toString() : ""}
                  onChange={setMobile}
                  isValid={Mobile !== undefined ? validateMobile(Mobile + "") : true}
                  errorMessage='Invalid Mobile Number! Accepted Format: 0123456789'
                  touched={true}
                  required={true}
                />
                </Form.Item>
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="emergencyContactName"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Name
                </label>
                <Form.Item style={{margin: 0}}>
                <Input
                  id="emergencyContactName"
                  type="text"
                  onBlur={() => handleBlur("emergencyContactName")}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
                </Form.Item>
              </div>
              <div className="mb-3 w-50 pe-2">
                <label
                  htmlFor="emergencyContactMobile"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Mobile
                </label>
                <Form.Item style={{margin: 0}}>
                <InputField3
                  id="EmergMobileNo"
                  label="Emergency Contact Mobile Number"
                  type="tel"
                  value={EmergencyContactMobile !== undefined ? EmergencyContactMobile.toString() : ""}
                  onChange={setEmergencyContactMobile}
                  isValid={EmergencyContactMobile !== undefined ? validateMobile(EmergencyContactMobile + "") : true}
                  errorMessage='Invalid Mobile Number! Accepted Format: 0123456789'
                  touched={true}
                  required={true}
                />
                </Form.Item>
              </div>
              <div className="mb-3 w-50">
                <label
                  htmlFor="emergencyContactRelation"
                  className="form-label"
                  style={{ fontSize: "14px" }}
                >
                  Emergency Contact Relation
                </label>
                <Form.Item style={{margin: 0}}>
                <Input
                  id="emergencyContactRelation"
                  type="text"
                  onBlur={() => handleBlur("emergencyContactRelation")}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                />
                </Form.Item>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center pt-1 mb-1 pb-1">
              <Button
                className="mb-3 w-100 submit"
                onClick={handleSignUp}
                type="primary"
              >
                Register
              </Button>
            </div>
            </Form>

            <div className="d-flex flex-row align-items-center justify-content-center pb-3 mb-3">
              <p className="mb-0">Pharmacist?</p>
              <Button
                type="dashed"
                danger
                style={{ marginLeft: "10px" }}
                onClick={handleRegisterPharmacist}
              >
                Register as Pharmacist
              </Button>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center pb-3 mb-3">
              <label style={{ marginRight: 5 }}>Already Registered? </label>
              <a href="/"> Login</a>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
