import { Button, Card, Col, Modal, Row, Select, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config, headers } from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";

const SalesReport: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<any[]>([]);
  //   const [month, setMonth] = useState<Dayjs | null>();
  const [month, setMonth] = useState<String>("");
  const [medicine, setMedicine] = useState<string>("");
  const [date, setDate] = useState<String>("");
  const [loading, setLoading] = useState(true);
  const [filteredResults, setfilteredResults] = useState([]);
  const [filtering, setFiltering] = useState<boolean>(false);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const { Option } = Select;

  const onMonthChange: DatePickerProps["onChange"] = (date, dateString) => {
    setMonth(dateString);
    api
      .get(`/pharmacist/salesReport`, {
        params: { month: dateString },
        headers,
      })
      .then((response) => {
        setReport(response.data);
        console.log("RES:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // console.log(date, dateString);
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const handleFilter = () => {
    if (medicine != "" || date != "") {

      api
        .get(`/pharmacist/filterReport`, {
          params: { medicineId: medicine, date: date},
          headers: headers,
        }) //get request
        .then((response) => {
          // setMedicines(response.data); //store response (medicines) in variable
          setfilteredResults(response.data);
          setLoading(false); //loading screen --> off
          setFiltering(true);
          setMedicine("");
          setMonth("");
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const clearFilter = async () => {
    try {
      setReport([]);
      setMedicine("");
      setFiltering(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    //loading screen
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        Sales Report
        {/* <strong>Your Notifications</strong> */}
      </h2>

      <div style={{ display: "flex", justifyContent: "center" , alignItems: "center"}}>
        <strong>Sales Month: </strong>
        <DatePicker onChange={onMonthChange} picker="month" style={{marginLeft: 10}}/>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <span>
          <label style={{ marginTop: 20 }}>
            <strong>Filter by Medicine:</strong>
          </label>
          <Select
            placeholder="Medicine"
            style={{ width: 150, marginRight: "20px", marginLeft: 5 }}
            onChange={setMedicine}
            value={medicine}
          >
            {report.map((medicine) => (
              <Option value={medicine.Medicine._id}>
                {medicine.Medicine.Name}
              </Option>
            ))}
          </Select>
          <label style={{ marginRight: 8 }}>
            <strong>From Date:</strong>
          </label>
          <DatePicker
            onChange={onDateChange}
            placeholder="Date"
            style={{ width: 150, marginRight: "20px" }}
            picker="date"
          />
          <button
            onClick={handleFilter}
            style={{ marginRight: 10 }}
            className="btn btn-sm btn-primary"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilter}
            style={{}}
            className="btn btn-sm btn-danger"
          >
            Clear Filters
          </button>
                  
        </span>
      </div>

      <table className="table" id="medicineResults">
        <thead>
          <tr style={{ fontSize: 22 }}>
            <th></th>
            <th>Medicine Name</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Total Profit</th>
          </tr>
        </thead>

        <tbody>
          {(filtering? filteredResults:report).map((request: any, index) => (
            <tr key={request._id} style={{ verticalAlign: "middle" }}>
              <td>
                <img
                  src={
                    request.Medicine.Image
                      ? `/images/${request.Medicine.Image.filename}`
                      : request.Medicine.imageURL
                  }
                  width={100}
                  height={100}
                ></img>
              </td>
              <td width={500}>
                <strong style={{ fontSize: 20 }}>
                  {request.Medicine.Name}
                </strong>
                <br></br>
                <br></br>
                {request.Medicine.Description}
              </td>
              <td
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  verticalAlign: "center",
                  textAlign: "center",
                }}
              >
                ${request.Medicine.Price}
              </td>
              <td style={{ textAlign: "center" }}>{request.Sales}</td>
              <td style={{ textAlign: "center" }}>
                ${request.Sales * request.Medicine.Price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default SalesReport;
