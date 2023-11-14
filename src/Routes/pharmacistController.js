const pharmacistModel = require("../Models/Pharmacist");
const PharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const medicineModel = require("../Models/Medicine");
const fileModel = require("../Models/File");
const multer = require("multer");
const bcrypt = require("bcrypt");
const express = require("express");

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
    cb(null, file.originalname + "-" +  Date.now());
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

const storageID = multer.diskStorage({
  fileName: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadID = multer({ storage: storageID });

const uploadPersonalID = async (req, res) => {

  uploadID.single("file")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {

      const { id } = req.params;  //get pharmacist id 

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
        Pharmacist: id,
      };

      try {
        const savedFile = await fileModel.create(newFile);    //save file in db
        const pharmacist = await pharmacistModel.findByIdAndUpdate(id, {    //add ID to pharm in db
          PersonalID: savedFile._id,
        });

        await pharmacist.save();

        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const storageDegree = multer.diskStorage({
  fileName: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadDegree = multer({ storage: storageDegree });

const uploadPharmacyDegree = async (req, res) => {

  uploadDegree.single("file")(req, res, async (err) => {
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
        Pharmacist: id,
      };

      try {
        const savedFile = await fileModel.create(newFile);
        const pharmacist = await pharmacistModel.findByIdAndUpdate(id, {
          PharmacyDegree: savedFile._id,
        });
        await pharmacist.save();
        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
};

const storageLicense = multer.diskStorage({
  fileName: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadLicense = multer({ storage: storageLicense });

const uploadLicenses = async (req, res) => {

  uploadLicense.array("files")(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {

      let newFiles = [];

      const { id } = req.params; 

      if (id && req.files) {
        newFiles = req.files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          filedata: file.buffer,
          Pharmacist: id,
        }));
      } else {
        res.status(404).json({ error: "No file(s) was selected" });
      }

      try {
        const savedFiles = await fileModel.create(newFiles);
        const pharmacist = await pharmacistModel.findByIdAndUpdate(
          id,
          {
            $push: {
              WorkingLicenses: { $each: savedFiles.map((file) => file._id) },
            },
          },
          { new: true }
        );
        await pharmacist.save();
        res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    }
  });
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
      });

      try {
        const savedFile = await newFile.save();

        // console.log(savedFile._id);
        
        // return savedFile;
        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        throw err;
        res.status(500).send("Server Error");
      }
    }
  });
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
  uploadLicenses
};
