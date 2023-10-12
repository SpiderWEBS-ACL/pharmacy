import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Spin } from "antd";
import { message } from "antd";

const EditMedicine = () => { // schema medicine 
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [Name, setName] = useState<string>(""); //start from here 
  const [Description, setDescription] = useState<string>("");
  const [Price, setPrice] = useState<number>(0);
  const [ActiveIngredients, setActiveIngredients] = useState<string>("");
  const [Quantity, setQuantity] = useState<number>(0);// till here 
  const [MedicinalUse, setMedicinalUse] = useState<string>("");
  const [imageURL, setimageURL] = useState<string>(""); 
  const [Sales, setSales] = useState<number>(0);
  
  const [Message, setMessage] = useState("");
  const [Alert, setAlert] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`/medicine/viewMedicineDetails/${id}`)
      .then((response) => {
        setName(response.data.Name); // same as schema 
        setDescription(response.data.Description);
        setPrice(response.data.Price);
        setActiveIngredients(response.data.ActiveIngredients);
        setQuantity(response.data.Quantity);
        setMedicinalUse(response.data.MedicinalUse);
        setimageURL(response.data.imageURL);
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
      const data = { // medicine schema 
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
      message.error("Failed to update Medicine");
    }
  };

//   const handleDelete = async () => {
//     try {
//       const response = await api.delete(`/admin/deletePackage/${id}`);
//       console.log("Response:", response.data);
//       message.success("Package deleted successfully");
//       setName("");
//       setDescription(0);
//       setPrice(undefined);
//       setActiveIngredients(undefined);
//       setQuantity(undefined);
//       setMedicinalUse(0);
//       setimageURL("");
//       setSales(undefined);
//     } catch (error) {
//       console.error("Error:", error);
//       message.error("Failed to delete package");
//     }
//   };

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
              value={Description} // medicine scheme  
              onChange={setDescription} //set methods in edit medicine 
            ></InputField>

            <InputField
              id="Price"
              label="Price"
              type="number"
              value={Price ||0}
              onChange={setPrice}
            ></InputField>

            <InputField
              id="ActiveIngredients"
              label="Active Ingredients"
              type="text"
              value={ActiveIngredients}
              onChange={setActiveIngredients}
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
              label="MedicinalUse"
              type="text"
              value={MedicinalUse}
              onChange={setMedicinalUse}
            ></InputField>

            <InputField
              id="imageURL"
              label="imageURL"
              type="text"
              value={imageURL}
              onChange={setimageURL}
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
          </form>
          {/* <Button
            style={{ marginRight: "10px", marginTop: "10px" }}
            color="danger"
            onClick={handleDelete}
          >
            Delete
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default EditMedicine;
