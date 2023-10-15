import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import { Button, Col, Row } from "react-bootstrap";
import { DatePicker, DatePickerProps, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const AllMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [medicinalUse, setMedicinalUse] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [filtering, setFiltering] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  useEffect(() => {
    //send http request to backend
    api
      .get(`medicine/viewMedicines`) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        setSearching(false);
        setFiltering(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const { Option } = Select;
  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/admin/medicineDetails/" + id);
  };

  const handleSearch = async () => {
    setSearching(true);
    setLoading(true);
    api
      .get(`medicine/searchForMedicine`, { params: { Name: searchValue } }) //get request
      .then((response) => {
        setSearchResults(response.data);
        setLoading(false); //loading screen --> off
        console.log(response.data);
        setFiltering(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const clearSearch = async () => {
    // setLoading(true);
    api
      .get(`medicine/viewMedicines`) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        setSearching(false);
        setFiltering(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFilter = () => {
    if(filterValue != ""){
      setMedicinalUse(filterValue);
      // setSearching(false);
      // setLoading(true);

      const data = JSON.parse(JSON.stringify((searching? searchResults:medicines).map(item => JSON.stringify(item))));

      api
        .post(`medicine/filterMedicineByMedicinalUse`, data, {
          params: { MedicinalUse: filterValue }
        }) //get request
        .then((response) => {
          // setMedicines(response.data); //store response (medicines) in variable
          setfilteredResults(response.data);
          setLoading(false); //loading screen --> off
          setFiltering(true);
          // setFilterValue("");
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const clearFilter = async () => {

    if(searching){
      api
      .get(`medicine/searchForMedicine`, { params: { Name: searchValue } }) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        console.log(response.data);
        setMedicinalUse("");
        setFilterValue("");
        setFiltering(false);
      })
      .catch((error) => {
        console.error("Error:", error) ;
      });
      
    }

    else{
      try {
        const response = await api.get(`/medicine/viewMedicines`);
        setMedicinalUse("");
        setMedicines(response.data);
        setFilterValue("");
        setFiltering(false);
        setSearching(false);
      } catch (error) {
        console.error(error);
      }
    }
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

      <span>
      <label style={{ marginRight: 8 }}>
          <strong>Filter by Medicinal Use:</strong>
        </label>
        <Select
          style={{ width: 150, marginRight: "20px" }}
          onChange={setFilterValue}
          value={filterValue}
        >
          <Option value="Cold">Cold</Option>
          <Option value="Allergies">Allergies</Option>
          <Option value="Nasal Congestion">Nasal Congestion</Option>
          <Option value="Pain Relief">Pain Relief</Option>
          <Option value="Headaches">Headaches</Option>
          <Option value="Irritation">Irritation</Option>
        </Select>

        {/* <label style={{ marginRight: 4, marginBottom: 20 }}>
          <strong>Filter By Medicinal Use:</strong>
        </label>
        <Input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ width: 150, marginRight: 10, borderRadius: 15 }}
        /> */}
        <button
          onClick={handleFilter}
          style={{ marginRight: 10 }}
          className="btn btn-sm btn-primary"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilter}
          style={{}}
          className="btn btn-sm btn-danger"
        >
          Clear Filters
        </button>
      </span>

      <div style={{ position: "relative", float: "right", marginBottom: 20 }}>
        <Input
          placeholder="Search Medicines..."
          style={{
            paddingLeft: 10,
            height: 30,
            borderRadius: 15,
            width: 200,
            borderColor: "darkgray",
          }}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />

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

      <div className="popup">
          <br></br>
        <Row>
        <Col md="auto">
          {searching && !filtering && (
              <h4>
              <b>Showing Search Results for:</b> {searchValue}
            </h4> 
          )}

          {searching && filtering && (
            <h4>
              <b>Showing Search Results for:</b> {searchValue} <b> used for: </b> {medicinalUse}
            </h4>    
          )}

          {filtering && !searching && medicinalUse != "" && (
              <h4>
                <b>Showing medicines used for:</b> {medicinalUse}
              </h4>
          )}
          </Col>

          {(filtering || searching) && (
            <Col style={{}}>
              <a href="" onClick={clearSearch} style={{fontSize: 16, float: "right", position: "absolute", marginTop: 3}}>   Show All Medicine</a>

            </Col>
            )}
        </Row>
        
      </div>

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
          {(searching? (filtering? filteredResults:searchResults): (filtering? filteredResults:medicines)).map((request: any, index) => (
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
