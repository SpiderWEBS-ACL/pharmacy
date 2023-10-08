const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION-----------------------------------------------

const registerPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({ Username: req.body.Username });
    if (!exists) {
      var newPatient = await patientModel.create(req.body);
      res.status(201).json(newPatient);
    } else {
      res.status(400).json({ error: "Username Already Taken!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,
};
