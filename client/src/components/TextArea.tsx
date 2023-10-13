import React from "react";
import {Input} from "antd";

interface TextAreaProps {
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

const TextArea: React.FC<TextAreaProps> = ({
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
          <select
            className={`form-control ${
              touched && !isValid ? "is-invalid" : ""
            }`}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select> 
        </div>
      );
    } else {
      return (
        <Input.TextArea
        // className={`form-control ${touched && !isValid ? "is-invalid" : ""}`}

          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoSize={true}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          style={{width: `${value.length}ch`, marginBottom: 7}}
        />
      );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>
        <strong>{label}:</strong>
      </label>
      <div className="input-container">
        {renderInput()}
        {touched && !isValid && (
          
          <div className="invalid-feedback">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
