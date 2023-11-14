import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
// import Button from "../../components/Button";
import { List, Row, Spin, Button, Select } from "antd";
import { message } from "antd";
import { IonProgressBar } from "@ionic/react";
// import { alignPropType } from "react-bootstrap/esm/types";
import TextArea from "../../components/TextArea";
import { headers } from "../../middleware/tokenMiddleware";
import Cookies from "js-cookie";
const { Option } = Select;

const addMedicine = () => {
  //   const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem("accessToken");
  const [Name, setName] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [Price, setPrice] = useState<number>();
  const [ActiveIngredients, setActiveIngredients] = useState([""]);
  const [ActiveIngredientsReq, setActiveIngredientsReq] =
    useState<boolean>(true);
  const [Ingredient, setIngredient] = useState<string>("");
  const [Quantity, setQuantity] = useState<number>();
  const [MedicinalUse, setMedicinalUse] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [Sales, setSales] = useState<number>(0);
  const [addedMedicine, setAddedMedicine] = useState<any | null>(null);
  const [Message, setMessage] = useState("");
  const [Alert, setAlert] = useState(false);
  const [error, setError] = useState("");
  const [viewMedsHidden, setViewMedsHidden] = useState<boolean>(true);

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  const uploadImage = async () => {
    try {
      if (!image) {
        message.error("Please select the file first!");
        return;
      }

      const formData = new FormData();
      formData.append("image", image);

      console.log(image);

      await api
        .post(`/pharmacist/uploadImage/`, formData, {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
            "Content-Type": "multipart/form-data",
            // "Content-Type" : 'application/x-www-form-urlencoded'
            // "Content-Type" : "application/json"
          },
        })
        .then((response) => {
          console.log("Response:", response.data);
          // setAddedMedicine(response.data);
          message.success("Image uploaded successfully");
          setAlert(true);
          return response.data;
        });
    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data.error;
        setError(apiError);
        message.error("Failed to upload Image:  " + apiError);
      } else {
        setError("An error occurred");
      }
    }
  };

  type data = {
    Name? : string,
    Description? : string,
    Price? : Number,
    ActiveIngredients? : string[],
    Quantity? : Number,
    MedicinalUse? : string,
    Image? :  any
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      
      const data : data = {
        Name,
        Description,
        Price,
        ActiveIngredients,
        Quantity,
        MedicinalUse,
      };

      if(image) {
       const image = await uploadImage();
       console.log(image);

        data.Image = image
      }

      const response = await api.post(`/pharmacist/addMedicine/`, data, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
          // "Content-Type": "multipart/form-data"
        },
      });
      console.log("Response:", response.data);
      // setAddedMedicine(responseJson.data);
      message.success("Medicine added successfully");

      setAlert(true);
      return;
      // navigate("/pharmacist/medicineDetails/" + responseJson.data._id);
      //   setViewMedsHidden(false);
    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data.error;
        setError(apiError);
        message.error("Failed to add Medcicine: " + apiError);
      } else {
        setError("An error occurred");
      }
    }
  };

  const addIngredient = async (ingredient: string) => {
    if (ingredient == "") {
      message.error("Please Specify Active Ingredient");
      return;
    } else if (ActiveIngredients[0] == "") {
      setActiveIngredients([Ingredient]);
    } else {
      setActiveIngredients([...ActiveIngredients, Ingredient]);
    }
    setIngredient("");
    setActiveIngredientsReq(false);
    return ActiveIngredients;
  };

  const removeIngredient = async (index: number) => {
    if (ActiveIngredients.length == 1) {
      message.error("Medicine must have at least 1 active ingredient");
    } else {
      const ingredients = ActiveIngredients.filter((_, i) => i !== index);
      setActiveIngredients(ingredients);
    }
  };

  const navigate = useNavigate();

  const viewMedicine = async () => {
    navigate("/pharmacist/medicineDetails/" + addedMedicine._id);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">
            <strong>Add Medicine</strong>
          </h2>
          <form onSubmit={handleSubmit}>
            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              required={true}
            ></InputField>
            <TextArea
              id="Description"
              label="Description"
              value={Description}
              onChange={setDescription}
              type="text"
              required={true}
            />
            <InputField
              id="Price"
              label="Price"
              type="number"
              value={Price}
              onChange={setPrice}
              required={true}
            ></InputField>
            <InputField
              id="Quantity"
              label="Quantity"
              type="number"
              value={Quantity}
              onChange={setQuantity}
              required={true}
            ></InputField>
            <div className="form-group">
              <label>
                <strong>Medicinal Use:</strong>
              </label>
              <div className="input-container">
                <Select
                  style={{ height: 40, marginBottom: 10 }}
                  onChange={setMedicinalUse}
                  value={MedicinalUse}
                >
                  <Option value="Cold">Cold</Option>
                  <Option value="Allergies">Allergies</Option>
                  <Option value="Nasal Congestion">Nasal Congestion</Option>
                  <Option value="Pain Relief">Pain Relief</Option>
                  <Option value="Headaches">Headaches</Option>
                  <Option value="Irritation">Irritation</Option>
                </Select>
              </div>
            </div>
            <Row>
              <InputField
                id="activeIngredients"
                label="Active Ingredients"
                type="text"
                value={Ingredient}
                onChange={setIngredient}
                required={ActiveIngredientsReq} //min 1 active ingredient
              ></InputField>
              <br></br>

              <button
                className="btn btn-danger"
                style={{
                  marginLeft: "10px",
                  marginTop: "25px",
                  verticalAlign: "middle",
                  padding: 0,
                  width: 35,
                  // fontSize: 14,
                  height: 30,
                }}
                type="button"
                onClick={(e: any) => addIngredient(Ingredient)}
              >
                <b>+</b>
              </button>
            </Row>
            <body style={{ backgroundColor: "transparent" }}>
              {ActiveIngredients.map((ingredient: any, index) =>
                ingredient != "" ? (
                  <Row>
                    <li>{ingredient}</li>

                    <Button
                      className="btn btn-sm btn-danger"
                      // id = {ingredient.name}
                      style={{
                        borderRadius: "5px",
                        height: 25,
                        width: 20,
                        padding: 0,
                        marginLeft: 10,
                      }}
                      onClick={(e) => removeIngredient(index)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </Button>
                  </Row>
                ) : null
              )}{" "}
            </body>{" "}
            {/* <InputField
              id="image"
              label="Image URL"
              type="text"
              value={imageURL}
              onChange={setImageURL}
              required={false}
            ></InputField> */}
            <div className="form-group" >
              <label>
                <strong>Image:</strong>
              </label>

              <div
                className="input-container"
                style={{ display: "flex", marginTop: 10 }}
              >
                <form>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => {
                      setImage(e.target.files[0]);
                    }}
                  ></input>
                </form>

                <button
                  style={{
                    marginLeft: "auto",
                    marginRight: "20px",
                    marginTop: 10,
                    fontSize: 14,
                  }}
                  className="btn btn-success"
                  // type="submit"
                  onClick={uploadImage}
                >
                  Upload Image
                </button>
              </div>
              <br />
              
            </div>
            <div style={{ justifyContent: "right", display: "flex" }}>
              <button
                className="btn btn-primary"
                style={{ marginRight: "10px", marginTop: "10px", fontSize: 18 }}
                type="submit"
              >
                Submit
              </button>
            </div>
            <button
              id="viewMed"
              className="btn btn-danger"
              style={{
                marginRight: "10px",
                marginTop: "10px",
                visibility: viewMedsHidden ? "hidden" : "visible",
              }}
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
