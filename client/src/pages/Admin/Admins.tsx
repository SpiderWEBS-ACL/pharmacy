import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import { config } from "../../middleware/tokenMiddleware";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:5000/admin",
  });

  useEffect(() => {
    api
      .get("/allAdmins",config)
      .then((response) => {
        setAdmins(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [deleted]);

  // const handleDelete = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     const response = await api.delete(`/removeAdmin/${id}`);
  //     setDeleted(!deleted);
  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  //   setLoading(false);
  // };

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
      <h2 className="text-center mt-4 mb-4">
        <strong>Admins</strong>
      </h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Username</th>
            {/* <th>Remove</th> */}
          </tr>
        </thead>
        <tbody>
          {admins.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Username}</td>
              {/* <td>
                <button
                  className="btn btn-sm btn-danger"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleDelete(request._id)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAdmins;
