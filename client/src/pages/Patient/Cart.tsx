import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const viewCart: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);

  const api = axios.create({
    baseURL: "http://localhost:5000/cart",
  });

  useEffect(() => {
    api
      .get(`/viewCart/${id}`, config)
      .then((response) => {
        setCart(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  useEffect(() => {
    if (cart.length > 0) {
      const medicineEntries = cart.map((item) => ({
        medicineId: item.medicine,
        quantity: item.quantity,
      }));

      const fetchMedicineDetails = async () => {
        const medicineDetails = [];
        for (const entry of medicineEntries) {
          try {
            const response = await api.get(`/medicines/${entry.medicineId}`);
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
  }, [cart]);

  //const navigate = useNavigate();

  //NAVIGATE TO PAYMENT GATEWAY

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
        <strong>Your cart</strong>{" "}
      </h2>

      <table className="table">
        <thead>
          <tr style={{ fontSize: 22 }}>
            <th></th>
            <th>Medicine Name</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {
            //what do i put here
          }
        </tbody>
      </table>
    </div>
  );
};

export default viewCart;
