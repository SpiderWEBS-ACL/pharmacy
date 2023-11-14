import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import TextArea from "../../components/TextArea";
import { Spin, Button, Input } from "antd";
import { List, Row } from "antd";
import { message } from "antd";
import { config, headers } from "../../middleware/tokenMiddleware";

const EditMedicine = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [Price, setPrice] = useState<number>();
  const [ActiveIngredients, setActiveIngredients] = useState([""]);
  const [Ingredient, setIngredient] = useState<string>("");
  const [Quantity, setQuantity] = useState<number>();
  ``;
  const [MedicinalUse, setMedicinalUse] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [Sales, setSales] = useState<number>();

  const [Message, setMessage] = useState("");
  const [Alert, setAlert] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  useEffect(() => {
    api
      .get(`/medicine/viewMedicineDetails/${id}`, config)
      .then((response) => {
        setName(response.data.Name);
        setPrice(response.data.Price);
        setDescription(response.data.Description);
        setQuantity(response.data.Quantity);
        setActiveIngredients(response.data.ActiveIngredients);
        setMedicinalUse(response.data.MedicinalUse);
        setImage(response.data.Image);
        setSales(response.data.Sales);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        Name,
        Description,
        Price,
        MedicinalUse,
        ActiveIngredients,
      };
      const response = await api.put(`/pharmacist/updateMedicine/${id}`, data, {
        headers: headers,
      });
      console.log("Response:", response.data);
      message.success("Medicine updated successfully");
      setAlert(true);
      navigate("/pharmacist/medicineDetails/" + id);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update medicine");
    }
  };

  const navigate = useNavigate();

  const backToMedicine = async () => {
    navigate("/pharmacist/medicineDetails/" + id);
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
    return ActiveIngredients;
  };

  const removeIngredient = async (index: number) => {
    if (ActiveIngredients.length == 1) {
      message.error("Medicine must have at least 1 active ingredient");
    } else {
      const ingredients = ActiveIngredients.filter((_, i) => i !== index);
      setActiveIngredients(ingredients);
    }
    // setIngredient("");
    // return ActiveIngredients
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">
            <strong>Edit Medicine</strong>
          </h2>
          <form onSubmit={handleSubmit}>
            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
            ></InputField>
            <TextArea
              id="Description"
              label="Description"
              value={Description}
              onChange={setDescription}
              type="text"
              isValid={false}
            />
            <InputField
              id="MedicinalUse"
              label="Medicinal Use"
              type="text"
              value={MedicinalUse || 0}
              onChange={setMedicinalUse}
            ></InputField>
            <InputField
              id="Price"
              label="Price"
              type="number"
              value={Price}
              onChange={setPrice}
            ></InputField>
            <Row>
              <InputField
                id="activeIngredients"
                label="Active Ingredients"
                type="text"
                value={Ingredient}
                onChange={setIngredient}
              ></InputField>
              <br></br>

              <button
                className="btn btn-danger"
                style={{
                  marginLeft: "10px",
                  marginTop: "20px",
                  width: 50,
                  height: 35,
                }}
                type="button"
                onClick={(e: any) => addIngredient(Ingredient)}
              >
                Add
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
                        height: 20,
                        paddingTop: 0,
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
            <br></br>
            <InputField
              id="Quantity"
              label="Quantity"
              type="number"
              value={Quantity || 0}
              onChange={setQuantity}
              // disabled={true}
            ></InputField>
            <InputField
              id="Sales"
              label="Sales"
              type="number"
              value={Sales || 0}
              onChange={setSales}
              disabled={true}
            ></InputField>
            <div className="form-group">
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
              </div>

              <br />
            </div>
            {/* <InputField
              id="imageURL"
              label="imageURL"
              type="text"
              value={imageURL}
              onChange={setImage}
            ></InputField> */}
            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              type="submit"
            >
              Submit
            </button>
            <button
              className="btn btn-danger"
              style={{ marginRight: "10px", marginTop: "10px" }}
              type="button"
              onClick={backToMedicine}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMedicine;
