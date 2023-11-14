const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
mongoose.set('strictQuery', false);
require("dotenv").config();
const bcrypt = require("bcrypt");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

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
  getMedicineQuantitySales,
  uploadDocuments,
  pharmacistInfo,
  changePasswordPharmacist,
  uploadImage,
  uploadPharmacyDegree,
  uploadPersonalID,
  uploadLicenses,
  getDocuments,
  getRegFiles,
  getLicenses,
} = require("./Routes/pharmacistController");


const { registerPatient,
   PatientInfo,
    viewPatientOrder,
     viewWallet,
      viewShippingAdresses, 
      addShippingAddress,
       changePasswordPatient,
       viewAllOrders,
       removeAllOrders,
       cancelOrder} = require("./Routes/patientController");


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
viewPatientCart,
getCartTotal,
payCartWithStripe, emptyCart, payCartWithWallet, placeOrder} = require("./Routes/cartController");
const { AdminProtect, PharmacistProtect, PatientProtect } = require("./middleware/authMiddleware");

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
app.use(express.json());


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

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../client/public/uploads')));

//---------------------------------------ENDPOINTS-----------------------------------------------

//-----------------------Login Endpoints----------------------------------------
app.post('/login', login);
app.post('/forgotPassword', forgotPassword);
app.post('/verifyOTP', verifyOTP);
app.put('/resetPassword', resetPassword);

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

app.post("/pharmacist/addMedicine", PharmacistProtect, addMedicine),
app.put("/pharmacist/updateMedicine/:id",PharmacistProtect, updateMedicine),
app.get("/pharmacist/getMedicineQuantitySales/:id",PharmacistProtect, getMedicineQuantitySales);

app.get("/pharmacist/registrationRequestDetails/:id", getPharmRegistrationReqDetails);
app.get("/pharmacist/getDocuments", getDocuments);

// app.get("/pharmacist/getRegFiles", PharmacistProtect, getRegFiles);
app.post("/pharmacist/uploadDocuments", PharmacistProtect, uploadDocuments);
app.post("/pharmacist/uploadImage", PharmacistProtect, uploadImage);

app.post("/pharmacist/uploadPersonalID/:id", uploadPersonalID);
app.post("/pharmacist/uploadDegree/:id", uploadPharmacyDegree);
app.post("/pharmacist/uploadLicenses/:id", uploadLicenses);

//------------------Patient Endpoints---------------------
app.get("/patient/me",PatientProtect, PatientInfo);
app.post("/patient/register", registerPatient);
app.get("/patient/orders", PatientProtect, viewAllOrders);
app.get("/patient/removeOrders", removeAllOrders);
app.get("/patient/viewOrder/:id", PatientProtect, viewPatientOrder);
app.get("/patient/shippingAddresses", PatientProtect,viewShippingAdresses)
app.put("/patient/shippingAddress",PatientProtect, addShippingAddress);
app.get("/patient/wallet",PatientProtect,viewWallet);
app.put("/patient/changePassword", PatientProtect, changePasswordPatient);
app.put("/patient/cancelOrder/:id", cancelOrder);


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
app.get("/cart/getCartTotal/:cartId",PatientProtect,getCartTotal);
app.post("/cart/payWithStripe/",PatientProtect,payCartWithStripe);
app.post("/cart/payWithWallet",PatientProtect,payCartWithWallet);
app.put("/cart/emptyCart",PatientProtect,emptyCart);
app.post("/cart/placeOrder", PatientProtect, placeOrder);




