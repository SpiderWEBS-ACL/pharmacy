const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

// FOR TESTING
const addPharmacist = async (req, res) => {
  try {
    const exists = await pharmacistModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'}  });
    const exists2 = await pharmacistModel.findOne({"Email" :{ $regex: '^' + req.body.Email + '$', $options:'i'} });
    if (!exists && !exists2) {
      const newPharm = await pharmacistModel.create(req.body);
      res.status(201).json(newPharm);
    }  
    else if(exists){
      res.status(400).json({error:  "Username already taken!" });
    } else{
        res.status(400).json({error:  "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//---------------------------------------REGISTRATION REQUEST-----------------------------------------------

const registerPharmacist = async (req, res) => {
  try {
    const exists = await pharmacistModel.findOne({"Username" : { $regex: '^' + req.body.Username + '$', $options:'i'}});
    const exists2 = await PharmacistRegisterRequestModel.findOne({"Username" : { $regex: '^' + req.body.Username + '$', $options:'i'} });
    const exists3 = await pharmacistModel.findOne({"Email" : { $regex: '^' + req.body.Email + '$', $options:'i'} });
    const exists4 = await PharmacistRegisterRequestModel.findOne({"Email" : { $regex: '^' + req.body.Email + '$', $options:'i'} });
    if(!exists && !exists2 && !exists3 && !exists4){
        req.body.Password = await bcrypt.hash(req.body.Password,10);
        var newPharm = await PharmacistRegisterRequestModel.create(req.body);
        res.status(201).json(newPharm);
    }
    else if(exists || exists2){
        res.status(400).json({error:  "Username already taken!" });
    }else{
        res.status(400).json({error:  "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//----------------------------MEDICINES--------------------------------------

const addMedicine = async (req, res) => {
  try {
    const exists = await medicineModel.findOne({ Name: { $regex: '^' + req.body.Name + '$', $options:'i'}});
    if (!exists) {
      const newMedicine = await medicineModel.create(req.body);
      res.status(201).json(newMedicine);
    } else {
      res.status(400).json({ error: "Medicine Already Exists!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedMedicine = await medicineModel.findByIdAndUpdate(id, updates, {
      new: true, // returns updated medicine
    });
    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineDetails = async (req, res) => {    //Display Quantity/Sales of ALL medicines
  try {
    const medicineDetails = await medicineModel.find({}, "Name Quantity Sales");
    res.status(200).json(medicineDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineQuantitySales = async (req, res) => {    //Quantity/Sales of ONE medicine
  const medID = req.params.id;
  try {
    if (!medID) {
      res.status(500).json({ error: "ID required" });
    }

    const medicineDetails = await medicineModel.findById(
      medID,
      "Name Quantity Sales"
    );

    if (!medicineDetails) {
      res.status(500).json({ error: "Medicine Not Found" });
    }

    res.status(200).json(medicineDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  addPharmacist,
  addMedicine,
  updateMedicine,
  getMedicineDetails,
  getMedicineQuantitySales,
};
