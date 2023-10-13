import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { alignPropType } from "react-bootstrap/esm/types";
// import SearchBar from "react-native-search-bar";
// import SearchBarComponent from "../../components/SearchBar";
// import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import { te } from "date-fns/locale";

const AllMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  useEffect(() => {         //send http request to backend 
    api
      .get(`medicine/viewMedicines`)        //get request 
      .then((response) => {
        setMedicines(response.data);        //store response (medicines) in variable
        setLoading(false);                  //loading screen --> off
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/pharmacist/medicineDetails/" + id);
  };
  const handleEditDetails = async (id: string) => {
    navigate("/pharmacist/editMedicine/" + id);
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log("searching...");
    api
      .get(`medicine/searchForMedicine`, {params: {Name: searchValue}})        //get request 
      .then((response) => {
        setMedicines(response.data);        //store response (medicines) in variable
        setLoading(false);                  //loading screen --> off
        console.log(response.data);
      })
      .catch((error) => {        
        console.error("Error:", error);
      });
   };
    
  

  if (loading) {        //loading screen
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

  return (              //html of page design
    <div className="container">
      
      <h2 className="text-center mt-4 mb-4"> <strong>Available Medicines</strong> </h2>
      
      <div style={{position: "relative", float: "right", marginBottom:20}}>
          
          <input
            placeholder="Search Medicines..."
            style={{paddingLeft: 10, height: 30, borderRadius: 15, alignSelf: "center"}}
            onChange={(e) => {setSearchValue(e.target.value)}}
            >
          </input>

          <button
              className="btn btn-danger"
              style={{ marginLeft: "10px" }}
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>

         <br></br>
      </div>
      
        

      <table className="table" id="medicineResults">
        <thead>
          <tr style={{fontSize: 22}}>
            <th></th>
            <th>Medicine Name</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((request: any, index) => (
            <tr key={request._id} style={{verticalAlign: "middle"}}>
              <td>
                <img src={request.imageURL} width={200} height={200} ></img>
              </td>
              <td width={500}>
                <strong style={{fontSize: 20}}>{request.Name}</strong><br></br><br></br>
                {request.Description}
              </td>
              <td style={{fontSize: 18, fontWeight: "bold"} }>{request.Price} LE</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(request._id)}
                >
                  View Details
                </button><br>
                </br><br></br>
                <button
                  className="btn btn-danger"
                  onClick={() => handleEditDetails(request._id)}
                  style={{width: 107}}
                >
                   Edit Details
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
