import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PharmaHome = () => {
  const id = localStorage.getItem("id");
  // const { id } =  useParams<{ id: string }>()

  const [pharmacistInfo, setPharmacistInfo] = useState<any>({});

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`/admin/getPharmacist/${id}`)
      .then((response) => {
        setPharmacistInfo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  var Dob = pharmacistInfo.Dob + "";
  console.log(Dob);
  const dateTimeParts: string[] = Dob.split("T");
  const datePart: string = dateTimeParts[0];
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Pharmacist Information</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {pharmacistInfo.Name}</h5>
          <p className="card-text">DOB: {datePart}</p>
          <p className="card-text">HourlyRate: {pharmacistInfo.HourlyRate}</p>
          <p className="card-text">Affiliation: {pharmacistInfo.Affiliation}</p>
          <p className="card-text">
            Educational Background: {pharmacistInfo.EducationalBackground}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PharmaHome;
