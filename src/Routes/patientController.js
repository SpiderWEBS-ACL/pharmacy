const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const pharmacistModel = require("../Models/Pharmacist");
const adminModel = require("../Models/Admin");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION-----------------------------------------------

const Cart = require("../Models/Cart");
const Config = require("../Models/Config");
const Patient = require("../Models/Patient");
const { generateAccessToken } = require("../middleware/authMiddleware");

const registerPatient = async (req, res) => {
  try {
    const exists = await Patient.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options: 'i' } });
    const exists2 = await Patient.findOne({ "Email": { $regex: '^' + req.body.Email + '$', $options: 'i' } });

    if (!exists && !exists2) {
      // Create a new patient
      req.body.Password = await bcrypt.hash(req.body.Password,10);
      const newPatient = await Patient.create(req.body);

      // Create a new cart for the patient
      const cart = new Cart();
      const config = new Config();
      await cart.save();
      await config.save();

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
    const  id  = req.user.id;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async(req, res) => {
  try{
    const patient = await patientModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'}});
    const pharmacist = await pharmacistModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'} });
    const admin = await adminModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'} });

    
    if (!pharmacist && !patient && !admin) {
      return res.status(400).json({ error: "Username not found!" });
    }
    else if(patient){
      if (await bcrypt.compare(req.body.Password, patient.Password)) {
        const user = {
          id: patient._id,
          role: "Patient"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: patient._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, id: patient._id, type:"Patient"});
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(pharmacist){
      if (await bcrypt.compare(req.body.Password, pharmacist.Password)) {
        const user = {
          id: pharmacist._id,
          role: "Pharmacist"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: pharmacist._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, id: pharmacist._id, type:"Pharmacist"});
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(admin){
      if (await bcrypt.compare(req.body.Password, admin.Password)) {
        const user = {
          id: admin._id,
          role: "Admin"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: admin._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({accessToken: accessToken, refreshToken: refreshToken, id: admin._id,type:"Admin" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,login,PatientInfo
};
