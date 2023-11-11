import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { format } from "date-fns";
import { Spin } from "antd";
import { JwtPayload, config, headers} from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

type OrderItem = {
    medicine: string;
    quantity: number;
  };
  
  type MedicineItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  };

  const viewOrder: React.FC = () => {
    const accessToken = Cookies.get("accessToken");
      let id = "";
      if (accessToken) {
        const decodedToken: JwtPayload = jwt_decode(accessToken);
        id = decodedToken.id as string;}
      const [order, setOrder] = useState<any>();
      const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
      const [loading, setLoading] = useState(true);
      const [medicines, setMedicines] = useState<MedicineItem[]>([]);
      const [total, setTotal] = useState<number | null>(null);
      const [error, setError] = useState<string | null>(null);
      const [alertVisible, setAlertVisibility] = useState(false);
    
    
      const api = axios.create({
        baseURL: "http://localhost:5000/patient",
      });
    
     
      useEffect(() => {
        api
          .get(`/viewOrder/${id}`, config)
          .then((response) => {
            setOrder(response.data);
            setOrderItems(response.data.medicines);
            console.log("RES:",response.data.medicines)
            if (response.data.medicines.length > 0) {
              const medicineEntries = orderItems.map((item: { medicine: any; quantity: any; }) => ({
                medicineId: item.medicine,
                quantity: item.quantity,
              }));
              console.log("MEDS: ",medicineEntries);
              const fetchMedicineDetails = async () => {
                const medicineDetails = [];
                for (const entry of medicineEntries) {
                  try {
                    const response = await api.get(`/medicines/${entry.medicineId}`);
                    console.log("RESPONSE: ", response)
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
              setTotal(order.TotalPrice);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                const apiError = error.response.data;
                setError(apiError);
              } else {
                setError("An error occurred");
              }
          });
        //   fetchOrderTotal();
      }, [orderItems.length]);
    
      const handleIncrease = async (id:string) => {
        await api.put(`/medicines/${id}`,{quantity:1}, {headers: headers})
        window.location.reload();
      }
      const handleDecrease = async (id:string) => {
        await api.put(`/medicines/${id}`,{quantity:-1}, {headers: headers})
        window.location.reload();
      }
    //   const fetchOrderTotal = async () => {
    //     try {
    //       const response = await api.get(`/getOrderTotal/${id}`, config); // Replace 'orderId' with the actual OrderId
    //       setTotal(response.data.total);
    //     } catch (error) {
    //       console.error("Error fetching order total:", error);
    //     }
    //   };
      
      const handleCancel = async () => {
       //call cancel order
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
            <strong>Order #{id}</strong>{" "}
          </h2>
    

          <table className="table">
            <thead>
              <tr style={{ fontSize: 22 }}>
                <th></th>
                <th>Medicine Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
    
            <tbody>
              {medicines.map((request: any, index) => (
                <tr key={request._id} style={{ verticalAlign: "middle" }}>
                  <td>
                    <img src={request.imageURL} width={200} height={200}></img>
                  </td>
                  <td width={500}>
                    <strong style={{ fontSize: 20 }}>{request.Name}</strong>
                    <br></br>
                    <br></br>
                    {request.Description}
                  </td>
                  <td style={{ fontSize: 18, fontWeight: "bold" }}>
                    {request.Price} USD
                  </td>
                  <td style={{ fontSize: 18, fontWeight: "bold" }}>
                    {request.quantity} 
                  </td>
    
                    </tr>
              ))}
            </tbody>
          </table>
          <div>
          <strong style={{ fontSize: 20 }}> Total: {total} USD </strong>
          </div>

           <h6>Delivery Address: {order.DeliveryAddress}</h6>
           <h6>Order Status: {order.Status}</h6>


          <button
          className="btn btn-danger"
          onClick={() => handleCancel()} >
              Cancel Order 
          </button>
        </div>
      );
    };



    export default viewOrder;