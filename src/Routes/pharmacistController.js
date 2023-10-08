const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const { default: mongoose } = require("mongoose");


// FOR TESTING
const addPharmacist = async (req,res) => {
    try {
        const newPharm = await pharmacistModel.create(req.body);
        res.status(201).json(newPharm);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

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

const addMedicine = async (req, res) => {
    //Req. 16 code here
}

const updateMedicine = async (req, res) => {
    //Req. 18 code here
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  addPharmacist
};
