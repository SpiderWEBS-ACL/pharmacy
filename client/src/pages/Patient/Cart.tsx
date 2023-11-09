import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JwtPayload, config} from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";


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
const accessToken = Cookies.get("accessToken");
  let id = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    id = decodedToken.id as string;}
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
        console.log("RES:",response.data.medicines)
        if (response.data.medicines.length > 0) {
          const medicineEntries = response.data.medicines.map((item: { medicine: any; quantity: any; }) => ({
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
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      
  }, [cart]);

  const navigate = useNavigate();
  // const handleViewDetails = async (id: string) => {
  //   navigate("/patient/medicineDetails/" + id);
  // };

  const handleRemove = async (id: string) => {
    try{
      await api.delete(`/medicines/${id}`, config)
      console.log("medicine removed:" ,id)

    }catch(error){
      console.log("error removing medicine: ", error);
    }
  }

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
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(request._id)}
                >
                  remove
                </button>
                </td>
                </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default viewCart;
