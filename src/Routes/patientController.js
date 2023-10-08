const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION-----------------------------------------------

const registerPatient = async (req, res) => {
  try {
    const newPatient = await patientModel.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//--------------------------------------MEDICINE------------------------------------------------

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

const filterMedicineByMedicinalUse = async (req,res) => {
  const medicinalUse = req.body.MedicinalUse;
  if (medicinalUse==null) {
      return res.status(400).json({ error: 'MedicinalUse parameter is required' });
    }
  try{
      const medicine = await medicineModel.find({ MedicinalUse: { $regex: medicinalUse, $options: "i"} }); 
      res.status(200).json(medicine);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching' });
  }
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,
  searchForMedicine,
  filterMedicineByMedicinalUse,
};
