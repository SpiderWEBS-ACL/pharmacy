import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { List, Row, Spin } from "antd";
import { message } from "antd";
import { IonProgressBar } from "@ionic/react";
import { Center } from "drei";
import { alignPropType } from "react-bootstrap/esm/types";

const addMedicine = () => {
//   const { id } = useParams<{ id: string }>();
    const [Name, setName] = useState<string>("");
    const [Description, setDescription] = useState<string>("");
    const [Price, setPrice] = useState<number>(0);
    const [ActiveIngredients, setActiveIngredients] = useState([""]);
    const [ActiveIngredientsReq, setActiveIngredientsReq] = useState<boolean>(true);
    const [Ingredient, setIngredient] = useState<string>("");
    const [Quantity, setQuantity] = useState<number>(0);
    const [MedicinalUse, setMedicinalUse] = useState<string>("");
    const [imageURL, setImage] = useState<string>("");
    const [Sales, setSales] = useState<number>(0);
    const [addedMedicine, setAddedMedicine] = useState<any | null>(null);
    const [Message, setMessage] = useState("");
    const [Alert, setAlert] = useState(false);
    const [viewMedsHidden, setViewMedsHidden] = useState<boolean>(true)

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        Name,
        Description,
        Price,
        ActiveIngredients,
        Quantity,
        MedicinalUse,
        imageURL,
        Sales,
      };
      const response = await api.post(`/pharmacist/addMedicine/`, data);
      console.log("Response:", response.data);
      setAddedMedicine(response.data);
      message.success("Medicine added successfully");
      setAlert(true);
      setViewMedsHidden(false);
    } catch (error) {
      console.error("Error:", error);
    //   setMessage(error+"");
      message.error("Failed to add medicine: " + error);
    }
}

const addIngredient = async(ingredient: string) => {
    if(ActiveIngredients[0] == ""){
        setActiveIngredients([Ingredient]);
    }
    else{
        setActiveIngredients([...ActiveIngredients, Ingredient]);
    }
    setIngredient("");
    setActiveIngredientsReq(false);
    return ActiveIngredients
}

const navigate = useNavigate();

const viewMedicine = async () => {
    navigate("/pharmacist/medicineDetails/" + addedMedicine._id)
}

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Add Medicine</h1>
          <form onSubmit={handleSubmit}>
          <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
            ></InputField>

            <InputField
              id="Description"
              label="Description"
              type="text"
              value={Description}
              onChange={setDescription}
            ></InputField>

            <InputField
              id="Price"
              label="Price"
              type="number"
              value={Price}
              onChange={setPrice}
            ></InputField>

            <InputField
              id="Quantity"
              label="Quantity"
              type="number"
              value={Quantity}
              onChange={setQuantity}
            ></InputField>

            <InputField
              id="MedicinalUse"
              label="Medicinal Use"
              type="text"
              value={MedicinalUse}
              onChange={setMedicinalUse}
            ></InputField>

            <Row >
            <InputField
              id="activeIngredients"
              label="Active Ingredients"
              type="text"
              value={Ingredient}
              onChange={setIngredient}
              required = {ActiveIngredientsReq}     //min 1 active ingredient
            ></InputField>
            <br></br>
            

            <button
              className="btn btn-danger"
              style={{ marginLeft: "10px", marginTop: "20px", width: 50, height:35}}
              type="button"
              onClick={(e:any) => addIngredient(Ingredient)}
            >
              Add
            </button>

            </Row>

            <body style={{backgroundColor: "transparent"}}> 
                {ActiveIngredients.map((ingredient: any) =>
                <li>{ingredient}</li>
             )} </body>  <br></br>
         
            <InputField
              id="Sales"
              label="Sales"
              type="number"
              value={Sales}
              onChange={setSales}
            ></InputField>

            <InputField
              id="image"
              label="Image URL"
              type="text"
              value={imageURL}
              onChange={setImage}
              required={false}
            ></InputField>

            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              type="submit"
            >
              Submit
            </button>

            <button
              id = "viewMed"
              className="btn btn-danger"
              style={{ marginRight: "10px", marginTop: "10px", visibility: viewMedsHidden? "hidden" : "visible" }}
              type="button"
              onClick={viewMedicine}
            >
              View Medicine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default addMedicine;
