import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Spin } from "antd";
import { message } from "antd";

const EditMedicine = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [ActiveIngredients, setActiveIngredients] = useState<[string]>([""]);
  const [Quantity, setQuantity] = useState<number>(0);
  const [MedicinalUse, setMedicinalUse] = useState<string>("");
  const [imageURL, setImage] = useState<string>("");
  const [Sales, setSales] = useState<number>(0);

  const [Message, setMessage] = useState("");
  const [Alert, setAlert] = useState(false);
  
  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  useEffect(() => {
    api
      .get(`/medicine/viewMedicineDetails/${id}`)
      .then((response) => {
        setName(response.data.Name);
        setPrice(response.data.Price);
        setDescription(response.data.Description);
        setQuantity(response.data.Quantity);
        setActiveIngredients(response.data.ActiveIngredients);
        setMedicinalUse(response.data.MedicinalUse);
        setImage(response.data.imageURL);
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
        ActiveIngredients,
        Quantity,
        MedicinalUse,
        imageURL,
        Sales,
      };
      const response = await api.put(`/pharmacist/updateMedicine/${id}`, data);
      console.log("Response:", response.data);
      message.success("Medicine updated successfully");
      setAlert(true);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update medicine");
    }
  };

  const navigate = useNavigate();

  const backToMedicine = async () => {
    navigate("/pharmacist/medicineDetails/" + id);
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
          <h1 className="mb-4">Edit Medicine</h1>
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
              value={Price || 0}
              onChange={setPrice}
            ></InputField>

            <InputField
              id="Quantity"
              label="Quantity"
              type="number"
              value={Quantity || 0}
              onChange={setQuantity}
            ></InputField>

            <InputField
              id="MedicinalUse"
              label="Medicinal Use"
              type="text"
              value={MedicinalUse || 0}
              onChange={setMedicinalUse}
            ></InputField>

            <InputField
              id="Sales"
              label="Sales"
              type="number"
              value={Sales || 0}
              onChange={setSales}
            ></InputField>

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
