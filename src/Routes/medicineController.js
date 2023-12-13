const medicineModel = require("../Models/Medicine");

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find({}).populate("Image");
    res.status(201).json(medicines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getActiveMedicines = async (req, res) => {
  try {
    const activeMedicines = await medicineModel.find({ Archived: "Archive" }).populate("Image");
    res.status(200).json(activeMedicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const viewAlternatives = async (req, res) => {
  const { medicineId } = req.params;

  try {
    // Find the medicine by ID to get its active ingredient
    const currentMedicine = await medicineModel.findById(medicineId);
    if (!currentMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const activeIngredient = currentMedicine.ActiveIngredients[0];
    const alternatives = await medicineModel.find({
      _id: { $ne: medicineId }, 
      ActiveIngredients: activeIngredient,
    });

    res.json(alternatives);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
  getAllMedicines,
  searchForMedicine,
  filterMedicineByMedicinalUse,
  viewMedicineDetails,
  getActiveMedicines,
  viewAlternatives
};
