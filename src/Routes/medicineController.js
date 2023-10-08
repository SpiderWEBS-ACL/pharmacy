const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");

const addMedicine = async (req, res) => {
  try {
    const newMedicine = await medicineModel.create(req.body);
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  const id = req.body.id;
  const updates = req.body.updates;
  try {
    const updatedMedicine = await medicineModel.findByIdAndUpdate(id, updates, {
      new: true,    // returns updated medicine
    }); 
    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found " });
    }
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const filterMedicineByMedicinalUse = async (req, res) => {
  const medicinalUse = req.body.MedicinalUse;
  if (medicinalUse == null) {
    return res
      .status(400)
      .json({ error: "MedicinalUse parameter is required" });
  }
  try {
    const medicine = await medicineModel.find({
      MedicinalUse: { $regex: medicinalUse, $options: "i" },
    });

    if (medicine.length == 0) {
      return res.status(400).json({ error: "No Medicine Found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

const getMedicineDetails = async (req, res) => {      //Display Quantity/Sales of ALL medicines
  try {
    const medicineDetails = await medicineModel.find({}, "Name Quantity Sales");
    res.status(200).json(medicineDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineQuantitySales = async (req, res) => {    //Quantity/Sales of ONE medicine

  try {
    const medID = req.body.id;

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

module.exports = {
  addMedicine,
  updateMedicine,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  getMedicineDetails,
  getMedicineQuantitySales,
};
