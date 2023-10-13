const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find({});
    res.status(201).json(medicines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchForMedicine = async (req, res) => {
  const Name = req.query.Name;
  if (Name == null) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    const medicine = await medicineModel.find({
      Name: { $regex: Name, $options: "i" },
    });

    // if (medicine.length == 0) {
    //   return res.status(404).json({ error: "Medicine Not Found" });
    // }

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

    // if (medicine.length == 0) {
    //   return res.status(400).json({ error: "No Medicine Found" });
    // }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

const viewMedicineDetails = async(req, res) => {
    try {
        const { id } = req.params;
    
        if(!id){
        return res.status(404).json({ error: "ID parameter required" });
        }
    
        const medicine = await medicineModel.findById(id);
    
        if (!medicine) {
        return res.status(404).json({ error: "Medicine Not Found" });
        }

        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
  getAllMedicines,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  viewMedicineDetails,
};
