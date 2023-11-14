import { Button, Col, Modal, Row, Spin, message } from "antd";
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

export type CartItem = {
  medicine: string;
  quantity: number;
};

export type MedicineItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const viewCart: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  let id = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    id = decodedToken.id as string;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [flag, setFlag] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "http://localhost:5000/cart",
  });

  useEffect(() => {
    api
      .get(`/viewCart/${id}`, config)
      .then((response) => {
        setCart(response.data);
        console.log("RES:", response.data.medicines);
        if (response.data.medicines.length > 0) {
          const medicineEntries = response.data.medicines.map(
            (item: { medicine: any; quantity: any }) => ({
              medicineId: item.medicine,
              quantity: item.quantity,
            })
          );
          console.log("MEDS: ", medicineEntries);
          const fetchMedicineDetails = async () => {
            const medicineDetails = [];
            for (const entry of medicineEntries) {
              try {
                const response = await api.get(
                  `/medicines/${entry.medicineId}`
                );
                console.log("RESPONSE: ", response);
                const medicine = response.data;
                medicine.quantity = entry.quantity;
                medicineDetails.push(medicine);
              } catch (error) {
                console.error("Error fetching medicine:", error);
              }
            }
            setMedicines(medicineDetails);
          };

          fetchMedicineDetails();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      
      fetchCartTotal();
  }, [cart.length,flag]);

  const handleIncrease = async (id:string) => {
    await api.put(`/medicines/${id}`,{quantity:1}, {headers: headers})
    setFlag(!flag);
  }
  const handleDecrease = async (id:string) => {
    await api.put(`/medicines/${id}`,{quantity:-1}, {headers: headers})
    setFlag(!flag);
  }

  const fetchCartTotal = async () => {
    try {
      const response = await api.get(`/getCartTotal/${id}`, config); // Replace 'cartId' with the actual cartId
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching cart total:", error);
    }
  };

  const handleCheckout = async () => {
    if(medicines.length == 0){
      message.error("Your Cart is Empty");
      return;
    }
    navigate("/patient/orderConfirmation");
  };

  const handleRemove = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/medicines/${id}`, config);
      console.log("medicine removed:", id);
      setLoading(false);
      setFlag(!flag);

    } catch (error) {
      console.log("error removing medicine: ", error);
    }
  };

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
        <strong>Your Cart</strong>{" "}
      </h2>

      <table className="table">
        <thead>
          <tr style={{ fontSize: 22 }}>
            <th></th>
            <th>Medicine Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((request: any, index) => (
            <tr key={request._id} style={{ verticalAlign: "middle" }}>
              <td>
                <img src={ request.Image? `/images/${request.Image.filename}` :request.imageURL} width={100} height={100}></img>
              </td>
              <td width={500}>
                <strong style={{ fontSize: 20 }}>{request.Name}</strong>
                <br></br>
                {request.Description}
              </td>
              <td style={{ fontSize: 18, fontWeight: "bold" }}>
                {request.Price} USD
              </td>
              <td style={{ fontSize: 18, fontWeight: "bold" , textAlign: "center"}}>
                {request.quantity}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(request._id)}
                >
                  remove &nbsp;
                  <DeleteOutlined />
                </button>
                <br></br>
                <br></br>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDecrease(request._id)}
                >
                  <MinusOutlined />
                </button>
                &nbsp; &nbsp; &nbsp;
                <button
                  className="btn btn-secondary"
                  onClick={() => handleIncrease(request._id)}
                >
                  <PlusOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{float: "right", textAlign: "right", marginRight: 20}}>
        <strong style={{ fontSize: 20 }}> Total: {total} USD </strong>
      <br /><br />
      <button className="btn btn-success" onClick={() => handleCheckout()} style={{ fontSize: 20 }} >
        Checkout
      </button>
      <br /><br />
      </div>
    </div>
  );
};

export default viewCart;
