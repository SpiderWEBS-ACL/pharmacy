import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Spin } from "antd";
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

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/patient/medicineDetails/" + id);
  };

  const handleSearch = async () => {
    setSearching(true);
    setLoading(true);
    console.log("searching...");
    api
      .get(`medicine/searchForMedicine`, { params: { Name: searchValue } }) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        console.log(response.data);
        setFiltering(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFilter = () => {
    setMedicinalUse(filterValue);
    setSearching(false);
    setLoading(true);
    api
      .get(`medicine/filterMedicineByMedicinalUse`, {
        params: { MedicinalUse: filterValue },
      }) //get request
      .then((response) => {
        setMedicines(response.data); //store response (medicines) in variable
        setLoading(false); //loading screen --> off
        setFiltering(true);
        setFilterValue("");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const clearFilter = async () => {
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
        <label style={{ marginRight: 4, marginBottom: 20 }}>
          <strong>Filter By Medicinal Use:</strong>
        </label>
        <Input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ width: 150, marginRight: 10, borderRadius: 15 }}
        />
        <button
          onClick={handleFilter}
          style={{ marginRight: 10 }}
          className="btn btn-sm btn-primary"
        >
          Apply Filters
        </button>
        <button onClick={clearFilter} className="btn btn-sm btn-danger">
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
          style={{ marginLeft: "10px", marginTop: -5 }}
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>

        <br></br>
      </div>

      {searching && (
        <div className="popup">
          <br></br>
          <h4>
            <b>Showing Search Results for:</b> {searchValue}
          </h4>
        </div>
      )}

      {filtering && medicinalUse != "" && (
        <div className="popup">
          <br></br>
          <h4>
            <b>Showing medicines used for:</b> {medicinalUse}
          </h4>
        </div>
      )}

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
                <img src={request.imageURL} width={200} height={200}></img>
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
