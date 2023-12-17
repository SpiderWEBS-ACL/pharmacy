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

const RegLog: React.FC = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [Username, setUsername] = useState<string>("");
  const [Gender, setGender] = useState<string>();
  const [Dob, setDob] = useState<Date>();
  const [Mobile, setMobile] = useState<string>("");
  const [EmergencyContactName, setEmergencyContactName] = useState<string>();
  const [EmergencyContactMobile, setEmergencyContactMobile] =
    useState<string>("");
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

  const toggleSignUp = () => {
    setModalActive(false);
    setIsSignUp(!isSignUp);
  };

  const closeModal = () => {
    setModalActive(false);
  };
  const color = 'rgb(57, 132, 237)'
  const { Header, Content, Footer} = Layout;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Roboto', sans-serif",
      }}
      className={`cont ${isSignUp ? "s--signup" : ""}`}
    >
      <div className="form sign-in ">

        
        <h2 className="h2">Welcome Back</h2>

        <InputField2
          id="Username"
          label="Username"
          type="text"
          value={Username}
          onChange={setUsername}
          onBlur={() => handleBlur("username")}
          required={true}
        />

        <InputField2
          id="Password"
          label="Password"
          type="password"
          value={Password}
          onChange={setPassword}
          required={true}
          onBlur={() => handleBlur("password")}
        />

        <Link
          to="/forgotPassword"
          className="forgot-pass text-right"
          style={{ display: "block", textAlign: "center" }}
        >
          Forgot Password?
        </Link>

        <button onClick={handleSignIn} type="button" className="submit button">
          Sign In
        </button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <button
          onClick={handleRegAsPharm}
          type="button"
          className="submit button"
        >
          Register As Pharmacist
        </button>
      </div>

      <div className="sub-cont">
        <div className="img">
          <div className={`img__text m--up ${isSignUp ? "" : ""}`}>
            <h2 className="h2">New here?</h2>
            <p>Sign up and discover a great amount of new opportunities!</p>
          </div>

          <div className={`img__text m--in ${isSignUp ? "" : "m--up"}`}>
            <h2 className="h2">One of us?</h2>
            <p className="p">
              If you already have an account, just sign in. We've missed you!
            </p>
          </div>

          <div className="img__btn" onClick={toggleSignUp}>
            <span className={`span m--up ${isSignUp ? "m--in" : ""}`}>
              Sign Up
            </span>
            <span className={`span m--in ${isSignUp ? "" : "m--up"}`}>
              Sign In
            </span>
          </div>
        </div>

        <div
          className="form sign-up"
          style={{ overflow: "auto", display: "block" }}
        >
          <h2 className="h2">Time to feel like home</h2>

          <div className="input_wrap">
            <InputField2
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
          </div>

          <div className="input_wrap">
            <InputField2
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
          </div>

          <div className="input_wrap">
            <InputField2
              id="Email"
              label="Email"
              type="text"
              value={Email}
              onChange={setEmail}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <label className="label">
              <span className="span">Date Of Birth</span>
              <input
                className="input"
                value={Dob !== undefined ? Dob.toISOString().split("T")[0] : ""}
                onChange={handleDobChange}
                type="date"
              />
            </label>
          </div>

          <div className="input_wrap">
            <InputField2
              id="Gender"
              label="Gender"
              type="select"
              options={["Male", "Female"]}
              value={Gender}
              onChange={setGender}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="MobileNo"
              label="Mobile Number"
              type="tel"
              value={Mobile !== undefined ? Mobile.toString() : ""}
              onChange={setMobile}
              isValid={Mobile !== undefined ? validateMobile(Mobile) : true}
              errorMessage="Invalid Mobile Number! Accepted Format: +201234567890 OR 0123456789"
              touched={true}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="EmergencyContName"
              label="Emergency Contact Name"
              type="text"
              value={EmergencyContactName}
              onChange={setEmergencyContactName}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="EmergencyContMobile"
              label="Emergency Contact Mobile"
              type="tel"
              value={
                EmergencyContactMobile !== undefined
                  ? EmergencyContactMobile.toString()
                  : ""
              }
              onChange={setEmergencyContactMobile}
              isValid={validateMobile(EmergencyContactMobile)}
              errorMessage="Invalid Mobile Number! Accepted Format: +201234567890 OR 0123456789"
              touched={true}
              required={true}
            />
          </div>

          <div className="input_wrap">
            <InputField2
              id="relation"
              label="Emergency Contact Relation"
              type="text"
              value={EmergencyContactRelation}
              onChange={setEmergencyContactRelation}
              required={true}
            />
          </div>

          <button
            onClick={handleSignUp}
            type="button"
            className=" button submit"
          >
            Sign Up
          </button>
        </div>

        <div
          className={`modal_wrapper ${modalActive ? "active" : ""}`}
          style={{ color: error ? "red" : "green" }}
        >
          <div className="shadow"></div>
          <div className="success_wrap" style={{ position: "absolute" }}>
            <div style={{ position: "absolute", top: 10, right: 20 }}>
              <IoClose
                name="close-outline"
                style={{ fontSize: 20, color: "black" }}
                onClick={closeModal}
              ></IoClose>
            </div>

            <span
              className="modal_icon"
              style={{ backgroundColor: "transparent", marginBottom: 10 }}
            >
              {!error && (
                <IoCheckmarkDoneCircleSharp style={{ color: "green" }} />
              )}
              {error && <IoAlertCircle style={{ color: "red" }} />}
            </span>
            <h6>{error ? error : "You are Now Registered Successfully!"}</h6>
          </div>
        </div>
      </div>
    </div>
      );
};

export default RegLog;
