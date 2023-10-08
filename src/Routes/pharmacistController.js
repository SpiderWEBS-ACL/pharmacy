const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");
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
const getMedicineDetails = async (req , res) => {
  try {
    const medicineDetails = await medicineModel.find({}, 'Name Quantity Sales');
     res.status(200).json(medicineDetails);

  } catch (error) {
    res.status(500).json({ error: error.message });
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
};


const addMedicine = async (req, res) => {
    //Req. 16 code here
}

const updateMedicine = async (req, res) => {
    //Req. 18 code here
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  filterMedicineByMedicinalUse,
  getMedicineDetails
};
