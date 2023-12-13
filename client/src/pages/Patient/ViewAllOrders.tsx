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

  const [orders, setOrders] = useState<any[]>([]);
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

  // Function to check if the order is processing
  const isProcessing = (order: any) => order.Status === "Processing";

  // Sort orders, processing orders first, then by date
  const sortedOrders = [...orders].sort((a, b) => {
    if (isProcessing(a) && !isProcessing(b)) {
      return -1;
    } else if (!isProcessing(a) && isProcessing(b)) {
      return 1;
    } else {
      // Sort by date if both orders have the same status
      return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    }
  });

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Your Orders</strong>
      </h2>

      {sortedOrders.map((order: any) => (
        <div key={order._id}>
          <Card
            title={`Order #${order._id}`}
            style={{ lineHeight: 2 }}
            onClick={() => {
              navigate(`/patient/viewOrder/${order._id}`);
            }}
            hoverable={true}
          >
            <Row>
              <Col style={{ marginRight: 40 }} span={10}>
                <b>Placed On: </b>
                {new Date(order.Date.split("T")[0]).toDateString()} <br />
                <b>Shipping Address: </b> {order.DeliveryAddress}
              </Col>
              <Col span={8}>
                <b>Total: </b> {order.TotalPrice} USD <br />
                <b>Payment Method: </b> {order.PaymentMethod}
              </Col>
              <Col span={4} style={{ float: "right", textAlign: "right", verticalAlign: "middle" }}>
                <b>Order Status: </b>
                <span
                  style={{
                    color:
                      order.Status === "Cancelled"
                        ? "red"
                        : order.Status === "Shipped"
                        ? "green"
                        : "black",
                  }}
                >
                  {order.Status}
                </span>
                <br />
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
