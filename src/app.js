const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const MongoURI = "mongodb+srv://zeinahezzah:el7a2ny%40DB@cluster0.mr96uvv.mongodb.net/Pharmacy";
const PORT = process.env.PORT || "5000";

//-------------------IMPORT MODELS---------------------------

const {
  addAdmin,
  removePharmacist,
  removePatient,
  getAllPharmsRegistrationReqs,
  getPharmRegistrationReqDetails,
  getPatient,
  getPharmacist,
} = require("./Routes/adminController");
const { registerPharmacist } = require("./Routes/pharmacistController");
const { registerPatient } = require("./Routes/patientController");
const Pharmacist = require("./Models/Pharmacist");

//----------------------CONFIGURATIONS------------------------

const app = express();

console.log("started");

// MongoDB Connection
mongoose
  .connect("mongodb+srv://zeinahezzah:el7a2ny%40DB@cluster0.mr96uvv.mongodb.net/Pharmacy",{ useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(PORT, () => {
      console.log(`Listening to requests on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});
app.use(express.json());


//---------------------------------------ROUTES-----------------------------------------------


//-----------------Admin Routes---------------------
app.post("/admin/addAdmin", addAdmin);

app.delete("/admin/removePharmacist", removePharmacist);
app.delete("/admin/removePatient", removePatient);

app.get("/admin/registrationRequests", getAllPharmsRegistrationReqs);
app.get("/admin/registrationRequestDetails", getPharmRegistrationReqDetails);
app.get("/admin/getPatient", getPatient);
app.get("/admin/getpharmacist", getPharmacist);

//-------------------Pharmacist Routes--------------------
app.post("/pharmacist/register", registerPharmacist);


//------------------Patient Routes---------------------
app.post("/patient/register", registerPatient);
