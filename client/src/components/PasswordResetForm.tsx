import Userfront from "@userfront/core";
import * as React from "react";
import { validatePassword } from "../utils/ValidationUtils";
import InputField from "./InputField";

// Initialize Userfront Core JS
Userfront.init("demo1234");

class Alert extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    if (!this.props.message) return "";
    return <div id="alert">{this.props.message}</div>;
  }
}

// Define the Password reset form component
class PasswordResetForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      password: "",
      passwordVerify: "",
      alertMessage: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAlertMessage = this.setAlertMessage.bind(this);
  }

  // Whenever an input changes value, change the corresponding state variable
  handleInputChange(event: any) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    // Reset the alert to empty
    this.setAlertMessage("");

    // Verify that the passwords match
    if (this.state.password !== this.state.passwordVerify) {
      return this.setAlertMessage("Passwords must match");
    }
    // Call Userfront.resetPassword()
    Userfront.resetPassword({
      password: this.state.password,
    }).catch((error) => {
      this.setAlertMessage(error.message);
    });
  }

  setAlertMessage(message: string) {
    this.setState({ alertMessage: message });
  }

  render() {
    return (
      <div>
        <Alert message={this.state.alertMessage} />

        <form onSubmit={this.handleSubmit}>
          
            <InputField
                id="Password"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                isValid={validatePassword(this.state.password)}                
                errorMessage="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
                required={true}
            />

            <InputField
                id="passwordVerify"
                label="Re-Type Password"
                type="password"
                value={this.state.passwordVerify}
                onChange={this.handleInputChange}
                //isValid={validatePassword(this.state.password)}                
                //errorMessage="Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit."
                required={true}
            />

          {/* <label>
            Re-type password
            <input
              name="passwordVerify"
              type="password"
              value={this.state.passwordVerify}
              onChange={this.handleInputChange}
            />
          </label> */}
          <button type="submit">Reset password</button>
        </form>
      </div>
    );
  }
}
