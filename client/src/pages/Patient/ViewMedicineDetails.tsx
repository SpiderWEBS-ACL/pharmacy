import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { format } from "date-fns";
import { Spin, message } from "antd";
import { config } from "../../middleware/tokenMiddleware";

const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicineDetails, setMedicineDetails] = useState<any>("");
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`medicine/viewMedicineDetails/${id}`,config)
      .then((response) => {
        setMedicineDetails(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  const navigate = useNavigate();

  const backToMeds = async () => {
    navigate("/patient/viewMedicines");
  };

  const handleAddToCart = async (id: string | undefined) => {
    try{
      await api.post(`/cart/medicines/${id}`,{}, config)
      message.success("Medicine added to cart")
      console.log("med added to cart", id)
    }catch(error){
      console.log("error adding to cart:",error);
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data;
        message.error(apiError);
      } else {
        message.error("An error occurred");
      }
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
      <h2 className="text-center mt-4 mb-4"><strong>Medicine Details</strong></h2>

    <Row className="item" style={{paddingLeft: 100, paddingTop: 30}}>
     
      <Col className="info">
        <strong style={{fontSize: 40}}>{medicineDetails.Name}</strong>
        <br />
        <br />
        <h5>{medicineDetails.Description}</h5><br></br>
        <h6><strong>Medicinal Use:</strong> {medicineDetails.MedicinalUse}</h6><br></br>
        <h6 style={{fontWeight: "bold"}}> Active Ingredients:</h6>
        <body style={{backgroundColor: "transparent"}}> {medicineDetails.ActiveIngredients.map((ingredient: any) =>
          <li>{ingredient}</li>
        )} </body> 

        <br></br>
        <Row className="priceRow"> 
         <Col>
           <button
              className="btn btn-primary"
              onClick={() => backToMeds()}
            >
                  Back To All Medicines
            </button>
          </Col>
        
          <Col style={{ textAlign: "right" }}>
            <strong style={{fontSize: 20}}>Price: {medicineDetails.Price} LE</strong>
          </Col>
        </Row>
      </Col>
      <Col sm={6}>
        <img src={medicineDetails.imageURL} width={300} height={300}></img>
        <br /><br />
        <div style={{display: "flex", justifyContent: "center"}}>
        <button
              className="btn btn-success"
              onClick={() => handleAddToCart(id)}
            >
                  Add To Cart
            </button>
          </div>
      </Col>
    </Row>
    <br />
   </div>
  );
}

export default MedicineDetails;
