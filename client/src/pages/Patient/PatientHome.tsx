import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PatientHome = () => {

  const id = localStorage.getItem("id");

  const [patientInfo, setPatientInfo] = useState<any>({});
  const [patientEmergencyContact, setEmergencyContact] = useState<any>({});

  const api = axios.create({
    baseURL: "http://localhost:5000/",
  });

  useEffect(() => {
    api
      .get(`/admin/getPatient/${id}`)
      .then((response) => {
        setPatientInfo(response.data);
       // setEmergencyContact(response.data.EmergencyContact);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  var Dob = patientInfo.Dob + "";

  const dateTimeParts: string[] = Dob.split("T");
  const datePart: string = dateTimeParts[0];
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Patient Information</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {patientInfo.Name}</h5>
          <p className="card-text">DOB: {datePart}</p>
          <p className="card-text">Gender: {patientInfo.Gender}</p>
          <p className="card-text">Mobile: {patientInfo.Mobile}</p>
          {/* <p className="card-text">
            Emergency Contact Name: {patientEmergencyContact.Name}
          </p>
          <p className="card-text">
            Emergency Contact Number: {patientEmergencyContact.Mobile}
          </p>
          <p className="card-text">
            Emergency Contact Relation:{" "}
            {patientEmergencyContact.relationToPatient}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
