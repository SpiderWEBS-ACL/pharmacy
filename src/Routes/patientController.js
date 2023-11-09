const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const pharmacistModel = require("../Models/Pharmacist");
const adminModel = require("../Models/Admin");
const orderModel= require("../Models/Orders");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION-----------------------------------------------

const Cart = require("../Models/Cart");
const Settings = require("../Models/Settings");
const Patient = require("../Models/Patient");


const registerPatient = async (req, res) => {
  try {
    const exists = await Patient.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await Patient.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });

    if (!exists && !exists2) {
      // Create a new patient
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      const newPatient = await Patient.create(req.body);

      // Create a new cart for the patient
      const cart = new Cart();
      const settings = new Settings();
      await cart.save();
      await settings.save();

      // Associate the cart with the patient
      newPatient.Cart = cart._id;
      await newPatient.save();

      res.status(201).json(newPatient);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const PatientInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const changePasswordPatient = async (req, res) => {
  try {
    const { id } = req.user;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res.status(404).json({ error: "Please fill out all required fields" });
    }

    //find patient to update password
    const patient = await patientModel.findById(id);

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, patient.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

     //new password same as old
     if(await bcrypt.compare(newPass, patient.Password)){
      return res.status(400).json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    const newPatient = await patientModel.findByIdAndUpdate(id, { Password: hashedPass }, {new:true});

    res.status(200).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewPatientOrder = async (req, res) => {
  try {
    const OrderId = req.params.id;
    console.log(OrderId)
 
    const Order = await orderModel.findById(OrderId).populate("Medicines.medicine");
    if (!Order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(Order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,
  PatientInfo,
  viewPatientOrder,
  changePasswordPatient,
};
