//MODELS
const adminModel = require("../Models/Admin");
const pharmacistModel = require("../Models/Pharmacist");
const patientModel = require("../Models/Patient");
const pharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");

const { default: mongoose } = require("mongoose");

//-------------------------------ADMIN-----------------------------

const getAllAdmins = async (req,res) =>{
  try{
      const admin = await adminModel.find({});
      res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addAdmin = async (req,res) => {
  try {

    if(!req.body.Username || !req.body.Password){
      return res.status(400).json({ error: "Missing Parameters" });
    }

      const exists = await adminModel.findOne({"Username" : req.body.Username});
      if(!exists){
          var newAdmin = await adminModel.create(req.body);
          res.status(201).json(newAdmin);
      }
      else {
          res.status(400).json({error:  "Username already taken!" });
      }
  }catch(error){
      res.status(400).json({ error: error.message });
  }
}

//---------------------------------------PATIENT-----------------------------------------------

const getAllPatients = async (req,res) =>{
  try{
      const patient = await patientModel.find({});
      res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const removePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id){
      return res.status(404).json({ error: "ID parameter required" });
    }

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
  try {
    const { id } = req.params;
    
    if(!id){
      return res.status(404).json({ error: "ID parameter required" });
    }

    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------PHARMACIST-----------------------------------------------

const getAllPharmacists = async (req,res) =>{
  try{
      const pharmacists = await pharmacistModel.find({});
      res.status(200).json(pharmacists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePharmacist = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id){
      return res.status(404).json({ error: "ID parameter required" });
    }

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
  try {
    const { id } = req.params;

    if(!id){
      return res.status(404).json({ error: "ID parameter required" });
    }

    const pharmacist = await pharmacistModel.findById(id);

    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const { id } = req.params;
    
    if(!id){
      return res.status(404).json({ error: "ID parameter required" });
    }

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

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  getAllAdmins,
  addAdmin,
  getAllPatients,
  getAllPharmacists,
  removePharmacist,
  removePatient,
  getAllPharmsRegistrationReqs,
  getPharmRegistrationReqDetails,
  getPatient,
  getPharmacist,
};
