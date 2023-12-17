import { Button, Card, Col, Modal, Row, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config, headers } from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import { Dayjs } from "dayjs";



const SalesReport: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<any[]>([]);
//   const [month, setMonth] = useState<Dayjs | null>();
  const [month, setMonth] = useState<String>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setMonth(dateString);
    api
    .get(`/admin/salesReport`, {params: {"month": dateString} , headers})
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
        <DatePicker onChange={onDateChange} picker="month" style={{marginLeft: 10}}/>
      </div>

     <br />
     <br />

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
          {report.map((request: any, index) => (
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
