const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
mongoose.set('strictQuery', false);
require("dotenv").config();
const bcrypt = require("bcrypt");

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
  acceptPharmacistRequest,
  rejectPharmacistRequest,
  changePasswordAdmin
} = require("./Routes/adminController");

const {
  registerPharmacist,
  addPharmacist,
  addMedicine,
  updateMedicine,
  getMedicineDetails,
  getMedicineQuantitySales,
  uploadDocuments,
  pharmacistInfo,
  changePasswordPharmacist,
} = require("./Routes/pharmacistController");

const { registerPatient, PatientInfo, viewPatientOrder, changePasswordPatient} = require("./Routes/patientController");

const {
  getAllMedicines,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  viewMedicineDetails,
} = require("./Routes/medicineController");

const {
  createCart,
  addMedicineToCart,
  removeMedicine,
  viewCart,
  viewMedicineDetailsInCart,
  updateMedicineQuantity,
viewPatientCart} = require("./Routes/cartController");
const { AdminProtect, PharmacistProtect, PatientProtect } = require("./middleware/authMiddleware");

const {
  createConfig,
  viewPatientConfig,
  addShippingAddress
 } = require("./Routes/settingsController");

 const {
  login,
  resetPassword,
  sendPasswordResetOTP,
  forgotPassword,
  verifyOTP
 } = require("./Routes/loginController");

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


// console.log(await bcrypt.compare("adminPass234", "$2b$10$GDx2MtOUhksjweB5.BRHA.e6teuzfGVJA5eL3pBomWk1culO4atx2"));

//---------------------------------------ENDPOINTS-----------------------------------------------

//-----------------------Login Endpoints----------------------------------------
app.post('/login', login);
app.post('/forgotPassword', forgotPassword);
app.post('/verifyOTP', verifyOTP);
app.post('/resetPassword', resetPassword);

//-----------------Admin Endpoints---------------------
app.post("/admin/addAdmin", AdminProtect, addAdmin);
app.put("/admin/changePassword", AdminProtect, changePasswordAdmin);
app.get("/admin/allAdmins", AdminProtect, getAllAdmins);
app.get("/admin/allPatients",AdminProtect, getAllPatients);
app.get("/admin/allPharmacists",AdminProtect, getAllPharmacists); 

app.delete("/admin/removePharmacist/:id",AdminProtect, removePharmacist);
app.delete("/admin/removePatient/:id",AdminProtect, removePatient);

app.get("/admin/registrationRequests",AdminProtect, getAllPharmsRegistrationReqs);
app.get("/admin/registrationRequestDetails/:id",AdminProtect, getPharmRegistrationReqDetails);
app.get("/admin/getPatient/:id",AdminProtect, getPatient);
app.get("/admin/getPharmacist/:id",AdminProtect, getPharmacist);
app.post("/admin/acceptPharmacist/:id",AdminProtect,acceptPharmacistRequest);
app.delete("/admin/rejectPharmacist/:id",AdminProtect, rejectPharmacistRequest);

//-------------------Pharmacist Endpoints--------------------
app.get("/pharmacist/me",PharmacistProtect, pharmacistInfo)
app.post("/pharmacist/addPharmacist", addPharmacist);
app.post("/pharmacist/register", registerPharmacist);
app.put("/pharmacist/changePassword", PharmacistProtect, changePasswordPharmacist);

app.post("/pharmacist/addMedicine",PharmacistProtect, addMedicine),
app.put("/pharmacist/updateMedicine/:id",PharmacistProtect, updateMedicine),
// app.get("/pharmacist/getMedicineDetails", getMedicineDetails);
app.get("/pharmacist/getMedicineQuantitySales/:id",PharmacistProtect, getMedicineQuantitySales);

app.post("/pharmacist/uploadDocuments", PharmacistProtect, uploadDocuments);

//------------------Patient Endpoints---------------------
app.get("/patient/me",PatientProtect, PatientInfo)
app.post("/patient/register", registerPatient);
app.put("/patient/changePassword", PatientProtect, changePasswordPatient);
app.get("/patient/viewOrder/:id", viewPatientOrder)

//------------------Medicine Endpoints------------------
app.get("/medicine/viewMedicines",PharmacistProtect || PatientProtect || AdminProtect, getAllMedicines);
app.get("/medicine/viewMedicineDetails/:id",PharmacistProtect || PatientProtect || AdminProtect, viewMedicineDetails);

app.get("/medicine/searchForMedicine",PharmacistProtect || PatientProtect || AdminProtect, searchForMedicine);
app.post("/medicine/filterMedicineByMedicinalUse",PharmacistProtect || PatientProtect || AdminProtect, filterMedicineByMedicinalUse);


//-----------------Cart Endpoints---------------------
app.post("/cart/createCart",createCart);
app.post("/cart/medicines/:medicineId",PatientProtect, addMedicineToCart);
app.put("/cart/medicines/:medicineId",PatientProtect, updateMedicineQuantity);
app.delete("/cart/medicines/:medicineId", PatientProtect, removeMedicine);
app.get("/cart/:cartId", viewCart);
app.get("/cart/viewCart/:id",PatientProtect, viewPatientCart);
app.get("/cart/medicines/:medicineId", viewMedicineDetailsInCart);


//------------------Config Endpoints--------------------
app.post("/config/createConfig",createConfig);
app.post("/config/addShippingAddress", addShippingAddress);
app.get("/config/viewConfig",viewPatientConfig);

