import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Layout, message ,Button , Row, Col} from "antd";
import {
  validateMobile,
  validatePassword,
  validateUsername,
} from "../utils/ValidationUtils";
import InputField2 from "../components/InputField2";
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
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';

const RegLog: React.FC = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>();
  const [Dob, setDob] = useState<Date>();
  const [Mobile, setMobile] = useState<number>();
  const [EmergencyContactName, setEmergencyContactName] = useState<string>();
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<number>();
  const [EmergencyContactRelation, setEmergencyContactRelation] =
    useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  const handleSignUp = async () => {
    if (
      !Name ||
      !Email ||
      !Password ||
      !Username ||
      !Gender ||
      !Dob ||
      !Mobile ||
      !EmergencyContactMobile ||
      !EmergencyContactName ||
      !EmergencyContactRelation
    ) {
      message.error("Please Fill In All Requirements");
      return;
    }

    try {
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
      setTimeout(toggleSignUp, 1500);
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

  const handleRegister = () =>{
    navigate("/register");
    window.location.reload();
    
  }
  const handleRegAsPharm = () => {
    navigate("/pharmacist/register");
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

  const handleDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Assuming the input format is "YYYY-MM-DD"
    const date = new Date(inputValue);

    if (!isNaN(date.getTime())) {
      setDob(date);
    } else {
      setDob(undefined); // Invalid input, clear the date
    }
  };


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const color = 'rgb(57, 132, 237)'
  const { Header, Content, Footer} = Layout;
  return (
    <MDBContainer className="my-5 gradient-form">

      <MDBRow>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">

            <div className="text-center">
              <img src="/logo.png"
                style={{width: '150px'}} alt="logo" />
            </div>

            <h3 style={{alignSelf: "center"}}>Login to your account</h3>
            <br></br>

            <MDBInput
              wrapperClass='mb-4'
              label='Username'
              id='form1'
              type='username'
              onChange={handleUsernameChange}
              value={Username} 
            />
            <MDBInput
            wrapperClass='mb-4'
            label='Password'
            id='form2'
            type='password'
            onChange={handlePasswordChange}
            value={Password}
          />

            <div className="text-center pt-1 mb-5 pb-1">
              <Button className="mb-4 w-100" onClick={handleSignIn} type= "primary">Sign in</Button>
              <a className="text-muted" href="/forgotPassword">Forgot password?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Button type="dashed" danger style={{marginLeft: '10px'}} onClick={handleRegister}>
                 Register
             </Button>
            </div>

          </div>

        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
          <img src="/ren.jpg"
               alt="ren" width='800vh' />
           

          </div>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
};

export default RegLog;
