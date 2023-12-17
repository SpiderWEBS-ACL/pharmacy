import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Layout, message, Button, Row, Col, Input } from "antd";

import Cookies from "js-cookie";
import { MDBContainer, MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";

const RegLog: React.FC = () => {
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit(event as any); // Manually trigger the form submission
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission

    if (!Username || !Password) {
      message.warning("Please Fill In All Fields");
      return;
    }

    try {
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

  const handleSignIn = async () => {
    if (!Username || !Password) {
      message.warning("Please Fill In All Fields");
      return;
    }

    try {
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

  const handleRegister = () => {
    navigate("/register");
    window.location.reload();
  };
  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    if (item.type == "Patient") {
      navigate(`/patient/Home`);
    } else if (item.type == "Pharmacist") {
      navigate(`/pharmacist/Home`);
    } else if (item.type == "Admin") {
      navigate(`/admin/Home`);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="/logo.png"
                style={{ width: "150px", marginTop: "5rem" }}
                alt="logo"
                onClick={() => {navigate("/")}}
              />
            </div>

            <h3 style={{ alignSelf: "center" }}>Login to your account</h3>
            <br></br>
            <div className="mb-4">
              <label>Username</label>
              <Input
                id="form1"
                type="username"
                onChange={handleUsernameChange}
                value={Username}
              />
            </div>
            <div className="mb-4">
              <label>Password</label>
              <Input.Password
                id="form2"
                type="password"
                onChange={handlePasswordChange}
                value={Password}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="text-center pt-1 mb-5 pb-1">
              <Button
                className="mb-4 w-100"
                onClick={handleSignIn}
                type="primary"
              >
                Sign in
              </Button>
              <a className="text-muted" href="/forgotPassword">
                Forgot password?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Button
                type="dashed"
                danger
                style={{ marginLeft: "10px" }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>
          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <img
              style={{ marginLeft: "0rem" }}
              src="/2.png"
              alt="ren"
              width="740vh"
            />
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default RegLog;
