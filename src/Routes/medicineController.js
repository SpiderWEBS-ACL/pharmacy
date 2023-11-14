const medicineModel = require("../Models/Medicine");

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find({}).populate("Image");
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
    }).populate("Image");

    // if (medicine.length == 0) {
    //   return res.status(404).json({ error: "Medicine Not Found" });
    // }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};


const filterMedicineByMedicinalUse = async (req, res) => {
  const medicinalUse = req.query.MedicinalUse;
  const medicinesJSON = req.body;

  if (medicinalUse == null) {
    return res
      .status(400)
      .json({ error: "MedicinalUse parameter is required" });
  }
  try {
    var medicines = [];

    for (var i = 0; i < medicinesJSON.length; i++) {
      const medicine = JSON.parse(medicinesJSON[i]);

      if (
        medicine.MedicinalUse.toLowerCase().includes(medicinalUse.toLowerCase())
      )
        medicines.push(medicine);
    }

    res.status(200).json(medicines);
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
    
        const medicine = await medicineModel.findById(id).populate("Image");
    
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
