const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const MedicineModel = require('../Models/Medicine');
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION REQUEST-----------------------------------------------

const registerPharmacist = async (req, res) => {
  try {
    const newPharm = await PharmacistRegisterRequestModel.create(req.body);
    res.status(201).json(newPharm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//------------------------------------MEDICINE------------------------------------

const addMedicine = async (req,res) => {
  try {
      const newMedicine = await MedicineModel.create(req.body);
      res.status(201).json(newMedicine);
  }catch(error){
      res.status(400).json({ error: error.message });
  }
}

module.exports = {addMedicine};

const updateMedicine = async (req,res) => {
  const id = req.body.id;
  const updates = req.body;
  try{
      const updateMedicine = await MedicineModel.findByIdAndUpdate(id, updates);
      if(!updateMedicine){
          return res.status(404).json({error: "Medicine not found "});
      }
      res.status(200).json(updateMedicine);
  }catch(error) { 
      res.status(500).json({error: error.message});
  }
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  addMedicine,
  updateMedicine
};
