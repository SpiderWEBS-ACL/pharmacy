//MODELS
const adminModel = require("../Models/Admin");
const pharmacistModel = require("../Models/Pharmacist");
const patientModel = require("../Models/Patient");
const pharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");

const { default: mongoose } = require("mongoose");

//-------------------------------ADMIN-----------------------------

const addAdmin = async (req, res) => {
  try {
    const exists = await adminModel.findOne({ Username: req.body.Username });
    if (!exists) {
      var newAdmin = await adminModel.create(req.body);
      res.status(201).json(newAdmin);
    } else {
      res.status(400).json({ error: "Username Already Taken!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//---------------------------------------PATIENT-----------------------------------------------

const removePatient = async (req, res) => {
  try {
    const id = req.body.id;
    const removedPatient = await patientModel.findByIdAndDelete(id);
    if (!removedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(removedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getPatient = async (req, res) => {
    //Req. 22 code here
}

//---------------------------------------PHARMACIST-----------------------------------------------

const removePharmacist = async (req, res) => {
  try {
    const id = req.body.id;
    const removedPharmacist = await pharmacistModel.findByIdAndDelete(id);
    if (!removedPharmacist) {
      return res.status(404).json({ error: "Pharmacist not found" });
    }
    res.status(200).json(removedPharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPharmacist = async (req, res) => {
    //Req. 23 code here
}

//---------------------------------------PHARMACIST REGISTRATION REQUESTS-----------------------------------------------

const getAllPharmsRegistrationReqs = async (req, res) => {
  try {
    const RegistrationReqs = await pharmacistRegisterRequestModel.find({});
    res.status(200).json(RegistrationReqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPharmRegistrationReqDetails = async (req, res) => {
  try {
    const id = req.body.id;
    const RegistrationReq = await pharmacistRegisterRequestModel.findById(id);
    if (!RegistrationReq) {
      return res
        .status(404)
        .json({ error: "Pharmacist registration request not found" });
    }
    res.status(200).json(RegistrationReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const searchForMedicine = async (req,res) => {
  const Name = req.body.Name;
  if (Name==null) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
  try{
      const medicine = await medicineModel.find({ Name: { $regex: Name, $options: "i"} }); 
      res.status(200).json(medicine);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching' });
  }
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  addAdmin,
  removePharmacist,
  removePatient,
  getAllPharmsRegistrationReqs,
  getPharmRegistrationReqDetails,
  searchForMedicine
};
