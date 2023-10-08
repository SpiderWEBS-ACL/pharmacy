const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const MongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || "5000";

//-------------------IMPORT MODELS---------------------------

const {
  addAdmin,
  removePharmacist,
  removePatient,
  getAllPharmsRegistrationReqs,
  getPharmRegistrationReqDetails,
} = require("./Routes/adminController");

const {
  registerPharmacist,
  addPharmacist,
} = require("./Routes/pharmacistController");

const {
  registerPatient,
  searchForMedicine,
} = require("./Routes/patientController");

//----------------------CONFIGURATIONS------------------------

const app = express();

// MongoDB Connection
mongoose
  .connect(MongoURI, { useNewUrlParser: true })
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

app.get("/admin/searchForMedicine", searchForMedicine);

//-------------------Pharmacist Routes--------------------
app.post("/pharmacist/addPharmacist", addPharmacist);
app.post("/pharmacist/register", registerPharmacist);

app.get("/pharmacist/searchForMedicine", searchForMedicine);

//------------------Patient Routes---------------------
app.post("/patient/register", registerPatient);

app.get("/patient/searchForMedicine", searchForMedicine);



