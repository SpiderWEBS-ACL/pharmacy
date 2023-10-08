const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");

// FOR TESTING
const addPharmacist = async (req, res) => {
  try {
    const newPharm = await pharmacistModel.create(req.body);
    res.status(201).json(newPharm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
  try {
    const newMedicine = await medicineModel.create(req.body);
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchForMedicine = async (req, res) => {
  const Name = req.body.Name;
  if (Name == null) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    const medicine = await medicineModel.find({
      Name: { $regex: Name, $options: "i" },
    });

    if (medicine.length == 0) {
      return res.status(400).json({ error: "Medicine Not Found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  addPharmacist,
  addMedicine,
  searchForMedicine,
};
