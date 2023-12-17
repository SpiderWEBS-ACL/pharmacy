const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");
const fileModel = require("../Models/File");
const multer = require("multer");
const bcrypt = require("bcrypt");
const express = require("express");
const Pharmacist = require("../Models/Pharmacist");
const Notification = require("../Models/Notification");
const doctorModel = require("../Models/Doctor");
const Orders = require("../Models/Orders");

// FOR TESTING
const addPharmacist = async (req, res) => {
  try {
    const exists = await pharmacistModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await pharmacistModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    if (!exists && !exists2) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      const newPharm = await pharmacistModel.create(req.body);
      res.status(201).json(newPharm);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const pharmacistInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const pharmacist = await pharmacistModel.findById(id);

    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePasswordPharmacist = async (req, res) => {
  try {
    const { id } = req.user;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res
        .status(404)
        .json({ error: "Please fill out all required fields" });
    }

    //find pharmacist to update password
    const pharmacist = await pharmacistModel.findById(id);

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, pharmacist.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

    //new password same as old
    if (await bcrypt.compare(newPass, pharmacist.Password)) {
      return res
        .status(400)
        .json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    const newPharmacist = await pharmacistModel.findByIdAndUpdate(
      id,
      { Password: hashedPass },
      { new: true }
    );

    res.status(200).json(newPharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------REGISTRATION REQUEST-----------------------------------------------

const registerPharmacist = async (req, res) => {
  try {
    const exists = await pharmacistModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await PharmacistRegisterRequestModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists3 = await pharmacistModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    const exists4 = await PharmacistRegisterRequestModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    if (!exists && !exists2 && !exists3 && !exists4) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newPharm = await PharmacistRegisterRequestModel.create(req.body);
      res.status(201).json(newPharm);
    } else if (exists || exists2) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//----------------------------MEDICINES--------------------------------------

const addMedicine = async (req, res) => {
  try {
    const exists = await medicineModel.findOne({
      Name: { $regex: "^" + req.body.Name + "$", $options: "i" },
    });
    if (!exists) {
      const newMedicine = await medicineModel.create(req.body);

      res.status(201).json(newMedicine);
    } else {
      res.status(400).json({ error: "Medicine Already Exists!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedMedicine = await medicineModel.findByIdAndUpdate(id, updates, {
      new: true, // returns updated medicine
    });
    if (!updatedMedicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineDetails = async (req, res) => {
  //Display Quantity/Sales of ALL medicines
  try {
    const medicineDetails = await medicineModel.find({}, "Name Quantity Sales");
    res.status(200).json(medicineDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMedicineQuantitySales = async (req, res) => {
  //Quantity/Sales of ONE medicine
  const medID = req.params.id;
  try {
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

//-----------------------UPLOAD FILES-------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "./client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const uploadDocuments = async (req, res) => {
  const upload = multer({ storage: storage });

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      //get Pharmacist id
      const { id } = req.user.id;

      const newFile = new fileModel({
        Pharmacist: id,
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
      });

      try {
        const savedFile = await newFile.save();
        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "./client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage: storageFiles });

const uploadPersonalID = async (req, res) => {
  uploads.single("file")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const { id } = req.params; //get regReq id

      if (!id) {
        res.status(400).send("Pharmacist's ID is missing");
        return;
      }

      //get file from request
      const file = req.file;

      if (!file) {
        res.status(400).send("No file uploaded");
        return;
      }

      //create new file
      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        contentType: file.mimetype,
        Pharmacist: id,
      };

      try {
        const savedFile = await fileModel.create(newFile); //save file in db
        const pharmacistReq =
          await PharmacistRegisterRequestModel.findByIdAndUpdate(id, {
            //add ID to pharm in db
            PersonalID: savedFile._id,
          });

        await pharmacistReq.save();

        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const uploadPharmacyDegree = async (req, res) => {
  uploads.single("file")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const { id } = req.params;

      if (!id) {
        res.status(400).send("Pharmacist's ID is missing");
        return;
      }

      const file = req.file;

      if (!file) {
        res.status(400).send("No file uploaded");
        return;
      }

      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        contentType: file.mimetype,
        Pharmacist: id,
      };

      try {
        const savedFile = await fileModel.create(newFile);
        const pharmacistReq =
          await PharmacistRegisterRequestModel.findByIdAndUpdate(id, {
            PharmacyDegree: savedFile._id,
          });
        await pharmacistReq.save();
        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const uploadLicenses = async (req, res) => {
  uploads.array("files")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const { id } = req.params;

      if (!id) {
        res.status(400).send("Pharmacist's ID is missing");
        return;
      }

      const newFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        Patient: id,
        contentType: file.mimetype,
      }));

      try {
        const savedFiles = await fileModel.create(newFiles);

        const pharmacistReq =
          await PharmacistRegisterRequestModel.findByIdAndUpdate(
            id,
            {
              $push: {
                WorkingLicenses: { $each: savedFiles.map((file) => file._id) },
              },
            },
            { new: true }
          );
        await pharmacistReq.save();
        res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const getDocuments = async (req, res) => {
  const id = req.user.id;
  try {
    let files = [];
    files = await fileModel.find({ Pharmacist: id });
    if (!files) {
      return res.status(404).json({ error: "No files found" });
    }
    if (files) {
      res.status(200).json(files);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//------------------------------------UPLOAD IMAGE--------------------------------------------

const storageImg = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "./client/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadImage = async (req, res) => {
  const upload = multer({ storage: storageImg });

  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const newFile = new fileModel({
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        contentType: req.file.mimetype,
      });

      try {
        const savedFile = await newFile.save();
        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};
const viewPharmaWallet = async (req, res) => {
  try {
    const pharmacistId = req.user.id;
    const pharmacist = await Pharmacist.findById(pharmacistId);
    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }
    res.status(200).json(pharmacist.Wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const archiveMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const Medicine = await medicineModel.findById(id);
    if (!Medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    Medicine.Archived = "Unarchive";
    await Medicine.save();
    res.status(200).json(Medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const unarchiveMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    const Medicine = await medicineModel.findById(id);
    if (!Medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    Medicine.Archived = "Archive";
    await Medicine.save();
    res.status(200).json(Medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllNotifications = async (req, res) => {
  try {
    const pharmacistId = req.user.id;
    const pharmacist = await Pharmacist.findById(pharmacistId);
    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }

    const notifications = await Notification.find({
      Pharmacist: pharmacistId,
    }).populate("Medicine");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const openNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification Not Found" });
    }

    notification.opened = true;
    notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadNotifs = async (req, res) => {
  try {
    const pharmId = req.user.id;
    const pharmacist = await pharmacistModel.findById(pharmId);

    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }

    const notifications = await Notification.find({
      Pharmacist: pharmacist,
      opened: false,
    }).populate("Medicine");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const Doctors = await doctorModel.find({});
    return res.status(200).json(Doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteNotifs = async (req, res) => {
  try {
    // const {id} = req.user;
    await Notification.deleteMany({});
    res.status(200).json("Notifications Deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findMedIndex = (medicines, medicineId) => {
  for (let i = 0; i < medicines.length; i++) {
    if (medicines[i]._id.toString() == medicineId.toString()) {
      return i;
    }
  }
};

const viewSalesReport = async (req, res) => {
  try {
    const { month } = req.query;

    const startDate = month + "-01";
    const endDate = month + "-31";

    // Find all orders where the orderDate is within date range
    const orders = await Orders.find({
      Date: { $gte: startDate, $lte: endDate },
    });

    const medicines = await medicineModel.find().populate("Image");

    var salesByMedicine = [{}];

    for (let i = 0; i < medicines.length; i++) {
      const medicine = medicines[i];

      const salesPerMed = { Medicine: medicine, Sales: 0 };

      salesByMedicine[i] = salesPerMed;
    }

    for (const order of orders) {
      for (const medicine of order.Medicines) {
        const medicineIndex = findMedIndex(medicines, medicine.medicine._id);

        salesByMedicine[medicineIndex].Sales += medicine.quantity;
      }
    }

    res.status(200).json(salesByMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterSalesReport = async (req, res) => {
  try {
    
    const medicineId = req.query.medicineId;

    const date = req.query.date;
  
    var orders;
  
    var salesByMedicine = [{}];
  
    if(date){
      orders = await Orders.find({ Date: { $gte: date } });
    }
    else{
      orders = await Orders.find({});
    }
  
    if (medicineId) {
      const medicine = await medicineModel.findById(medicineId);

      const salesByMed = { Medicine: medicine, Sales: 0 };
  
      for (const order of orders) {
        for (const med of order.Medicines) {

          if (med.medicine._id == medicineId) {
            salesByMed.Sales += med.quantity;
          }
        }
      }
  
      salesByMedicine = [salesByMed];
    }
    else{ 
      const medicines = await medicineModel.find().populate("Image");
  
      for (let i = 0; i < medicines.length; i++) {
        const medicine = medicines[i];
  
        const salesPerMed = { Medicine: medicine, Sales: 0 };
  
        salesByMedicine[i] = salesPerMed;
      }
  
      for (const order of orders) {
        for (const medicine of order.Medicines) {
          const medicineIndex = findMedIndex(medicines, medicine.medicine._id);
  
          salesByMedicine[medicineIndex].Sales += medicine.quantity;
        }
      }
    }
  
    res.status(200).json(salesByMedicine);

  } catch (error) {
    res.status(500).json({error: error.message});

  }
 


};

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPharmacist,
  addPharmacist,
  addMedicine,
  updateMedicine,
  getMedicineDetails,
  getMedicineQuantitySales,
  uploadDocuments,
  uploadImage,
  pharmacistInfo,
  changePasswordPharmacist,
  uploadPharmacyDegree,
  uploadPersonalID,
  uploadLicenses,
  getDocuments,
  viewPharmaWallet,
  archiveMedicine,
  unarchiveMedicine,
  viewAllNotifications,
  getAllDoctors,
  openNotification,
  getUnreadNotifs,
  deleteNotifs,
  viewSalesReport,
  filterSalesReport,
};
