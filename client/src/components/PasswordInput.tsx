import React from "react";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";

interface PasswordInputProps {
  id: string;
  label?: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  isValid?: boolean;
  errorMessage?: string;
  touched?: boolean;
  visible?: boolean;
  disabled?: boolean;
  required?: boolean;
  endAdornment?: any;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  isValid,
  errorMessage,
  touched,
  visible,
  disabled,
  required,
  endAdornment
}) => {

  const renderInput = () => {
    return (
      <div>
        <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
        <Input
          id = {id}
          type={visible ? "text" : "password"}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={disabled}
          required={required}
          onBlur={onBlur}
          endAdornment = {endAdornment}
        />
      </div>
    );
  };

  return (
    <div className="form-group">
      <div className="input-container">
        {renderInput()}
        {touched && !isValid && (
          <div className="text-danger" style={{ textAlign: "center" }}>
            <small>{errorMessage}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
