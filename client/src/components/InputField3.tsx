import React from "react";
import { Layout, message, Button, Input, Select, DatePicker, Form } from "antd";


interface InputFieldProps {
  id: string;
  label?: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  isValid?: boolean;
  errorMessage?: string;
  touched?: boolean;
  disabled?: boolean;
  options?: string[];
  required?: boolean;
}

const {Option} = Select; 

const prefixSelector = (
  <Select style={{ width: 70 }}>
    <Option value="20">+20</Option>
  </Select>
);

const InputField3: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  isValid,
  errorMessage,
  touched,
  disabled,
  options,
  required
}) => {
  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <div>
          {" "}
          {/* Wrap select and arrow in a container */}
          <Select
                  style={{ width: "12.8rem" }}
                  onChange={(e) => onChange(e.target.value)}
                >
                  {options.map((option) => (
                    <Option value={option}>
                      {option}
                    </Option>
                  ))}

                </Select>
        </div>
      );
    }
    else if (type == "tel") {
        return (
          <Input
            addonBefore={prefixSelector}
            style={{ width: "100%" }}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />)
        } 

    else if (type == "password"){
      return (
        <Input.Password
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="password"
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          />
      )
    }
    else {
      return (
        <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type === "select" ? "text" : type}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        style={{width: "95%"}}
      />
      );
    }
  };

  return (
    <div className="form-group">
         <div className="input-container">
        {renderInput()}
        {touched && !isValid && (
            <div className="text-danger" style={{textAlign: "center"}}>
                <small>{errorMessage}</small>
            </div>
        )}
      </div>
    </div>
  );
};

export default InputField3;
