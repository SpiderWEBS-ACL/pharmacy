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

const { registerPatient } = require("./Routes/patientController");

const {
  addMedicine,
  updateMedicine,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  getMedicineDetails,
  getMedicineQuantitySales,
} = require("./Routes/medicineController");

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

//---------------------------------------ENDPOINTS-----------------------------------------------

//-----------------Admin Endpoints---------------------
app.post("/admin/addAdmin", addAdmin);

app.delete("/admin/removePharmacist", removePharmacist);
app.delete("/admin/removePatient", removePatient);

app.get("/admin/registrationRequests", getAllPharmsRegistrationReqs);
app.get("/admin/registrationRequestDetails", getPharmRegistrationReqDetails);

//-------------------Pharmacist Endpoints--------------------
app.post("/pharmacist/addPharmacist", addPharmacist);
app.post("/pharmacist/register", registerPharmacist);

//------------------Patient Endpoints---------------------
app.post("/patient/register", registerPatient);

//------------------Medicine Endpoints------------------
app.post("/medicine/addMedicine", addMedicine),
app.put("/medicine/updateMedicine", updateMedicine),
app.get("/medicine/searchForMedicine", searchForMedicine);
app.get("/medicine/filterMedicineByMedicinalUse", filterMedicineByMedicinalUse);
app.get("/medicine/getMedicineDetails", getMedicineDetails);
app.get("/medicine/getMedicineQuantitySales", getMedicineQuantitySales);
