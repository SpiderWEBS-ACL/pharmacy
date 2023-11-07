import React, { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import InputField from "../../components/InputField";
import {
  validateUsername,
  validatePassword,
} from "../../utils/ValidationUtils";
import { headers } from "../../middleware/tokenMiddleware";

const AddAdminForm: React.FC = () => {
  const [Username, setUsername] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
  });

  const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
  });

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUsernameValid = validateUsername(Username);
    const isPasswordValid = validatePassword(Password);

    if (!isUsernameValid || !isPasswordValid) {
      setError("Username and Password must meet the minimum requirements.");
      return;
    }

    const data = {
      Username,
      Password,
    };

    try {
      const response = await api.post("/admin/addAdmin", data, {
        headers: headers,
      });
      console.log("Response:", response.data);

      setError(null);
    } catch (error) {
      console.error("Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        setError(apiError);
      } else {
        setError("An error occurred");
      }
    }

    setAlertVisibility(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <h2>Add Admin</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="Username"
            label="Username"
            type="text"
            value={Username}
            onChange={setUsername}
            onBlur={() => handleBlur("username")}
            isValid={validateUsername(Username)}
            errorMessage="Username must be at least 3 characters long."
            touched={touchedFields.username}
          />
          <InputField
            id="Password"
            label="Password"
            type="password"
            value={Password}
            onChange={setPassword}
            onBlur={() => handleBlur("password")}
            isValid={validatePassword(Password)}
            errorMessage="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
            touched={touchedFields.password}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-primary"
              type="submit"
              style={{ alignSelf: "flex-end" }}
            >
              Submit
            </button>
          </div>
          {alertVisible && (
            <Alert
              type={error ? "danger" : "success"}
              onClose={() => setAlertVisibility(false)}
            >
              {error ? error : "Admin added Successfully"}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
