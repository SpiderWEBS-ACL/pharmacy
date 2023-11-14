import { Button, Card, Col, Modal, Row, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JwtPayload, config, headers } from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined
} from "@ant-design/icons";


const ViewAllOrders: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  let id = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    id = decodedToken.id as string;
  }

  console.log(id);
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`/patient/orders`, config)
      .then((response) => {
        setOrders(response.data);
        console.log("RES:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }, []);

  async function getDate(date: string) {
    var dateObj = new Date(date.split("T")[0]);
    console.log(dateObj);
    setDate(dateObj.getDate().toString());
  }

  if (loading) {
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
        {" "}
        <strong>Your Orders</strong>{" "}
      </h2>

        {orders.map((order: any) => (
            <div>

                <Card title={`Order #${order._id}`} style={{lineHeight: 2}} onClick={()=> {navigate(`/patient/viewOrder/${order._id}`)}} hoverable={true}>
                    <Row>
                        <Col style={{marginRight: 40}} span={10}>
                    <b>Placed On: </b>{(new Date(order.Date.split("T")[0])).toDateString()} <br />
                    <b>Shipping Address: </b> {order.DeliveryAddress}
                    </Col>
                    <Col span={8}>
                    <b>Total: </b> {order.TotalPrice} USD <br />
                    <b>Payment Method: </b> {order.PaymentMethod}
                    </Col>
                    <Col span= {4} style={{float: "right", textAlign: "right", verticalAlign: "middle"}} >
                    <b>Order Status: </b>
                    <span
                        style={{
                        color:
                            order.Status == "Cancelled"
                            ? "red"
                            : order.Status == "Shipped"
                            ? "green"
                            : "black",
                        }}
                    >
                        {order.Status}
                    </span>
                        <br />
                    {/* <button className="btn btn-primary" onClick={()=> {navigate(`/patient/viewOrder/${order._id}`)}} style={{marginTop: 5}}>
                        View Details
                    </button> */}

                    </Col>
                    </Row>
                </Card>
                <br />
            </div>
        ))}
    </div>
  );
};

export default ViewAllOrders;