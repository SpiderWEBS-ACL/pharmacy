const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
mongoose.set('strictQuery', false);
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
  getPatient,
  getPharmacist,
  getAllAdmins,
  getAllPatients,
  getAllPharmacists,
} = require("./Routes/adminController");

const {
  registerPharmacist,
  addPharmacist,
  addMedicine,
  updateMedicine,
  getMedicineDetails,
  getMedicineQuantitySales,
  uploadDocuments,
} = require("./Routes/pharmacistController");

const { registerPatient, login } = require("./Routes/patientController");

const {
  getAllMedicines,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  viewMedicineDetails,
} = require("./Routes/medicineController");

//----------------------CONFIGURATIONS------------------------

const app = express();
app.use(cors());


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

app.get("/admin/allAdmins",getAllAdmins);
app.get("/admin/allPatients",getAllPatients);
app.get("/admin/allPharmacists",getAllPharmacists); 

app.delete("/admin/removePharmacist/:id", removePharmacist);
app.delete("/admin/removePatient/:id", removePatient);

app.get("/admin/registrationRequests", getAllPharmsRegistrationReqs);
app.get("/admin/registrationRequestDetails/:id", getPharmRegistrationReqDetails);
app.get("/admin/getPatient/:id", getPatient);
app.get("/admin/getPharmacist/:id", getPharmacist);

//-------------------Pharmacist Endpoints--------------------
app.post("/pharmacist/addPharmacist", addPharmacist);
app.post("/pharmacist/register", registerPharmacist);

app.post("/pharmacist/addMedicine", addMedicine),
app.put("/pharmacist/updateMedicine/:id", updateMedicine),
// app.get("/pharmacist/getMedicineDetails", getMedicineDetails);
app.get("/pharmacist/getMedicineQuantitySales/:id", getMedicineQuantitySales);

app.post("/pharmacist/uploadDocuments/:id", uploadDocuments);

//------------------Patient Endpoints---------------------
app.post("/patient/register", registerPatient);
app.post("/patient/login",login)
//------------------Medicine Endpoints------------------
app.get("/medicine/viewMedicines", getAllMedicines);
app.get("/medicine/viewMedicineDetails/:id", viewMedicineDetails);

app.get("/medicine/searchForMedicine", searchForMedicine);
app.post("/medicine/filterMedicineByMedicinalUse", filterMedicineByMedicinalUse);