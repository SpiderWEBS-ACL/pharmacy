const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const MedicineModel = require("../Models/Medicine");
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
  
    try {
        const newMedicine = await MedicineModel.create(req.body);
        res.status(201).json(newMedicine);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
 

    //Req. 16 code here
}

const updateMedicine = async (req, res) => {
    //Req. 18 code here
}

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
  registerPharmacist,
  addPharmacist,
  addMedicine,
  searchForMedicine
};
