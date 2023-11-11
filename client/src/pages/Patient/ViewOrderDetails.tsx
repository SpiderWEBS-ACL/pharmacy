import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { format } from "date-fns";
import { Spin } from "antd";
import { config } from "../../middleware/tokenMiddleware";

type CartItem = {
    medicine: string;
    quantity: number;
  };
  
  type MedicineItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  };

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [orderDetails, setOrderDetails] = useState<any>("");
    const [loading, setLoading] = useState(true);
    const [medicines, setMedicines] = useState<MedicineItem[]>([]);

    const api = axios.create({
      baseURL: "http://localhost:5000/patient",
    });

    useEffect(() => {
        api
          .get(`/viewOrder/${id}`,config)
          .then((response) => {
            setOrderDetails(response.data);
            setLoading(false);
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        //   const medicineEntries = orderDetails.Medicines.map((item: { medicine: any; quantity: any; }) => ({
        //     medicineId: item.medicine,
        //     quantity: item.quantity,
        //   }));

        //   const fetchMedicineDetails = async () => {
        //     const medicineDetails = [];
        //     for (const entry of medicineEntries) {
        //       try {
        //         const response = await api.get(`/medicines/${entry.medicineId}`);
        //         const medicine = response.data;
        //         medicine.quantity = entry.quantity;
        //         medicineDetails.push(medicine);
        //       } catch (error) {
        //         console.error("Error fetching medicine:", error);
        //       }
        //     }
        //     setMedicines(medicineDetails);
        //   };
    
        //   fetchMedicineDetails();
      }, [id]);
    
      const navigate = useNavigate();
    
      const backToMeds = async () => {
        navigate("/patient/viewOrder");
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
          <h2 className="text-center mt-4 mb-4"><strong>Order Details</strong></h2>
    
        <Row className="item" style={{paddingLeft: 100, paddingTop: 30}}>
         
          <Col className="info">
            <strong style={{fontSize: 40}}>{orderDetails.Medicine}</strong>
            <br />
            <br />
            
            <h6>{orderDetails.Medicine}</h6><br></br>   //get table from cart file
            <h6>{orderDetails.TotalPrice}</h6><br></br>
            <h6>{orderDetails.DeliveryAddress}</h6><br></br>
            <h6>{orderDetails.Status}</h6><br></br>
            <br></br>
          </Col>
        </Row>
       </div>
      );
    }
    
    export default OrderDetails;
    