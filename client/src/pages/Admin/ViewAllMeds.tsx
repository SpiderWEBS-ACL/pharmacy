import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { alignPropType } from "react-bootstrap/esm/types";
import SearchBar from "react-native-search-bar";

const AllMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");

  const api = axios.create({
    baseURL: "http://localhost:5000/medicine",
  });

  useEffect(() => {
    //send http request to backend
    api
      .get(`/viewMedicines`) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/admin/medicineDetails/" + id);
  };

  if (loading) {
    //loading screen
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
    //html of page design
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        {" "}
        <strong>Available Medicines</strong>{" "}
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
                <img
                  alt={request.Name + " Picture"}
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
                {request.Price} LE
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(request._id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllMedicines;
