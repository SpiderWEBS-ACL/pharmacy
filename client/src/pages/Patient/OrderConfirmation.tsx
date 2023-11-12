import { Button, Card, Col, Modal, Row, Spin, Select, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JwtPayload, config, headers } from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  WalletFilled,
  CreditCardFilled,
  DollarCircleFilled,
} from "@ant-design/icons";

const { Option } = Select;

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

const OrderConfirmation: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  let id = "";
  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    id = decodedToken.id as string;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shipping, setShippingAddress] = useState<String>("No Shipping Address Selected")
  const [shippingAddresses, setShippingAddresses] = useState<string[]>([]);
  const [newShippingAddress, setNewShippingAddress] = useState<string>("");
  const [addingNewAddress, setAddingNewAddress] = useState(false);

  const [showShippingModal, setShowShippingModal] = useState(false);

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
    fetchShippingAddress();
    fetchCartTotal();
    fetchShippingAddress();
  }, [cart.length]);

  const fetchShippingAddress = async () =>{
    try{
      const response = await axios.get("http://localhost:5000/patient/shippingAddresses", config);
      setShippingAddresses(response.data);
    }catch(error){
      console.error("Error fetching shipping address:", error);
    }
  }

  const fetchCartTotal = async () => {
    try {
      const response = await api.get(`/getCartTotal/${id}`, config); // Replace 'cartId' with the actual cartId
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching cart total:", error);
    }
  };
  const Balance = () => {
    axios
      .get("http://localhost:5000/patient/wallet", config)
      .then((response) => {
        setBalance(response.data);
      });
  };

  const payWithStripe = async () => {
    await api
      .post("/payWithStripe/", {}, config)
      .then((response) => {
        window.location.href = response.data.url;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckout = () => {
    Balance();
    setShowPaymentModal(true);
  };
  const handleChangeAddress = () =>{
    setShowShippingModal(true)
  }

  const handleSaveAddress = () => {
    if (newShippingAddress) {
      try{
          axios.put("http://localhost:5000/patient/shippingAddress", {address: newShippingAddress},config);
      }catch{
        console.log("shipping address add error")
      }
      setShippingAddress(newShippingAddress);
      setShowShippingModal(false);
    }
  };


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

  const handlePaymentSelection = (type: string) => {
    if (type === "Wallet") {
      payWithWallet()
    } else if (type === "Card") {
      payWithStripe();
    } else {
      payCOD();
    }
  };
  const payCOD = () =>{
   
      window.location.href = "http://localhost:5173/patient/success"
  }
  const payWithWallet = async () =>{
    await api
    .post("/payWithWallet", {}, config)
    .then((response) => {
      
      window.location.href = response.data;
      
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <h2 className="text-center mt-4 mb-4">
        {" "}
        <strong>Order Confirmation</strong>{" "}
      </h2>
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col span={16}>
          <div className="container">
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
                      <img
                        src={request.imageURL}
                        width={200}
                        height={200}
                      ></img>
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
            <Modal
              title="Select Payment Method"
              visible={showPaymentModal}
              onCancel={() => {
                setShowPaymentModal(false);
              }}
              footer={null}
            >
              <Button
                disabled={balance < total}
                type="primary"
                block
                style={{ marginBottom: "8px" }}
                onClick={() => handlePaymentSelection("Wallet")}
              >
                <Row justify="center" align="middle">
                  <Col>
                    <WalletFilled />
                  </Col>
                  <Col style={{ marginLeft: 8, textAlign: "center" }}>
                    {" "}
                    Wallet (Balance: ${balance})
                  </Col>
                </Row>
              </Button>
              <Button
                type="primary"
                block
                style={{ marginBottom: "8px" }}
                onClick={() => handlePaymentSelection("Card")}
              >
                <Row justify="center" align="middle">
                  <Col>
                    <CreditCardFilled />
                  </Col>
                  <Col style={{ marginLeft: 8, textAlign: "center" }}>Card</Col>
                </Row>
              </Button>
              <Button
                type="primary"
                block
                onClick={() => handlePaymentSelection("COD")}
              >
                <Row justify="center" align="middle">
                  <Col>
                    <DollarCircleFilled />
                  </Col>
                  <Col style={{ marginLeft: 8, textAlign: "center" }}>COD</Col>
                </Row>
              </Button>
            </Modal>
            <Modal
      title="Select Delivery Address"
      visible={showShippingModal}
      onCancel={() => {
        setShowShippingModal(false);
        setAddingNewAddress(false);
        setNewShippingAddress("");
      }}
      footer={null}
    >
      <Select
        value={shipping}
        style={{ width: "100%" }}
        onChange={(value) => setShippingAddress(value)}
      >
        {shippingAddresses.map((address, index) => (
          <Option key={index} value={address}>
            {address}
          </Option>
        ))}
      </Select>
      <br></br>
      {addingNewAddress ? (
        <div>
          <Input
            placeholder="Enter a new shipping address"
            value={newShippingAddress}
            onChange={(e) => setNewShippingAddress(e.target.value)}
          />
          <br></br>
          <Button
            type="primary"
            block
            onClick={() => handleSaveAddress()}
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type="primary"
          block
          onClick={() => setAddingNewAddress(true)}
        >
          Add New Address
        </Button>
      )}
    </Modal>
          </div>
        </Col>
        <Col span={8}>
          <Card title="Order Summary">
            {/* Delivery Address */}
            <div style={{ marginBottom: 16 }}>
              <strong>Delivery Address:</strong>
              {shipping}
              <button
              className= "btn btn-secondary"
              onClick={()=> handleChangeAddress()}
              >Change Delivery Address</button>
            </div>

            {/* Total */}
            <div style={{ marginBottom: 16 }}>
              <strong>Total:</strong> {total} USD
            </div>

            {/* Confirm Order Button */}
            <button
              className="btn btn-success"
              onClick={() => handleCheckout()}
            >
              Confirm Order
            </button>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderConfirmation;
