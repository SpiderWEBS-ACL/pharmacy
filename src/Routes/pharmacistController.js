const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
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

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
};
