//MODELS
const adminModel = require("../Models/Admin");
const pharmacistModel = require("../Models/Pharmacist");
const patientModel = require("../Models/Patient");
const pharmacistRegisterRequestModel = require("../Models/PharmacistRegisterRequest");
const bcrypt = require("bcrypt");

const { default: mongoose } = require("mongoose");
const fileModel = require("../Models/File");

//-------------------------------ADMIN-----------------------------

const getAllAdmins = async (req, res) => {
  try {
    const admin = await adminModel.find({});
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    if (!req.body.Username || !req.body.Password || !req.body.Email) {
      return res.status(400).json({ error: "Missing Parameters" });
    }

    const exists = await adminModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await adminModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });

    if (!exists && !exists2) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newAdmin = await adminModel.create(req.body);
      res.status(201).json(newAdmin);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already taken!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePasswordAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res
        .status(404)
        .json({ error: "Please fill out all required fields" });
    }

    //find admin to update password
    const admin = await adminModel.findById(id);

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, admin.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

    //new password same as old
    if (await bcrypt.compare(newPass, admin.Password)) {
      return res
        .status(400)
        .json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    const newAdmin = await adminModel.findByIdAndUpdate(
      id,
      { Password: hashedPass },
      { new: true }
    );

    res.status(200).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------PATIENT-----------------------------------------------

const getAllPatients = async (req, res) => {
  try {
    const patient = await patientModel.find({});
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "ID parameter required" });
    }

    const removedPatient = await patientModel.findByIdAndDelete(id);
    if (!removedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(removedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "ID parameter required" });
    }

    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------PHARMACIST-----------------------------------------------

const getAllPharmacists = async (req, res) => {
  try {
    const pharmacists = await pharmacistModel.find({});
    res.status(200).json(pharmacists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePharmacist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "ID parameter required" });
    }

    const removedPharmacist = await pharmacistModel.findByIdAndDelete(id);
    if (!removedPharmacist) {
      return res.status(404).json({ error: "Pharmacist not found" });
    }
    res.status(200).json(removedPharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPharmacist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "ID parameter required" });
    }

    const pharmacist = await pharmacistModel.findById(id);

    if (!pharmacist) {
      return res.status(404).json({ error: "Pharmacist Not Found" });
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------------PHARMACIST REGISTRATION REQUESTS-----------------------------------------------

const getAllPharmsRegistrationReqs = async (req, res) => {
  try {
    const RegistrationReqs = await pharmacistRegisterRequestModel.find({});
    res.status(200).json(RegistrationReqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPharmRegistrationReqDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "ID parameter required" });
    }
    const RegistrationReq = await pharmacistRegisterRequestModel
      .findById(id)
      .populate([
        {
          path: "PersonalID",
          model: "File",
        },
        {
          path: "PharmacyDegree",
          model: "File",
        },
        {
          path: "WorkingLicenses",
          model: "File",
        },
      ])
      .exec();

    if (!RegistrationReq) {
      return res
        .status(404)
        .json({ error: "Pharmacist registration request not found" });
    }
    res.status(200).json(RegistrationReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const acceptPharmacistRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID parameter required" });
    }

    const registrationRequest = await pharmacistRegisterRequestModel.findById(
      id
    );

    if (!registrationRequest) {
      return res
        .status(404)
        .json({ error: "Pharmacist registration request not found" });
    }
    const newPharmacist = await pharmacistModel.create({
      Username: registrationRequest.Username,
      Name: registrationRequest.Name,
      Email: registrationRequest.Email,
      Password: registrationRequest.Password,
      Dob: registrationRequest.Dob,
      HourlyRate: registrationRequest.HourlyRate,
      Affiliation: registrationRequest.Affiliation,
      EducationalBackground: registrationRequest.EducationalBackground,
      PersonalID: registrationRequest.PersonalID,
      PharmacyDegree: registrationRequest.PharmacyDegree,
      WorkingLicenses: registrationRequest.WorkingLicenses
    });
    await newPharmacist.save();

    //link files to pharmacist
    const files = await fileModel.updateMany({Pharmacist: id}, {Pharmacist: newPharmacist._id}, {new:true});

    await pharmacistRegisterRequestModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Pharmacist request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const rejectPharmacistRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID parameter required" });
    }
    const registrationRequest = await pharmacistRegisterRequestModel.findById(
      id
    );
    if (!registrationRequest) {
      return res
        .status(404)
        .json({ error: "Pharmacist registration request not found" });
    }
    await pharmacistRegisterRequestModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Pharmacist request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteFiles= async(req, res) => {
  try{
    // const {id} = req.user;
    await fileModel.deleteMany({});

    res.status(200).json("Files Deleted");
  }
  catch(error){
    res.status(400).json({error: error.message})
  }}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  getAllAdmins,
  addAdmin,
  getAllPatients,
  getAllPharmacists,
  removePharmacist,
  removePatient,
  getAllPharmsRegistrationReqs,
  getPharmRegistrationReqDetails,
  getPatient,
  getPharmacist,
  acceptPharmacistRequest,
  rejectPharmacistRequest,
  changePasswordAdmin,
  deleteFiles
};
