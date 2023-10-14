const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const pharmacistModel = require("../Models/Pharmacist");
const adminModel = require("../Models/Admin");
const { default: mongoose } = require("mongoose");

//---------------------------------------REGISTRATION-----------------------------------------------

const registerPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({"Username" : { $regex: req.body.Username, $options: "i" } });
    const exists2 = await patientModel.findOne({"Email" : { $regex: req.body.Email, $options: "i" } });
    if(!exists && !exists2){
        var newPatient = await patientModel.create(req.body);
        res.status(201).json(newPatient);
    }
    else if(exists){
        res.status(400).json({error:  "Username already taken!" });
    }else{
        res.status(400).json({error:  "Email already registered!" });
    }
  }catch(error){
      res.status(400).json({ error: error.message });
  }
};

const login = async(req, res) => {
  try{
    const usernamePat = await patientModel.findOne({ "Username": { $regex: req.body.Username, $options: "i" } });
    const usernamePharma = await pharmacistModel.findOne({ "Username": { $regex: req.body.Username, $options: "i" }  });
    const usernameAdm = await adminModel.findOne({ "Username": { $regex: req.body.Username, $options: "i" }  });

    
    if (!usernamePharma&& !usernamePat && !usernameAdm) {
      return res.status(400).json({ error: "Username not found!" });
    }
    else if(usernamePat){
      if (usernamePat.Password === req.body.Password) {
        res.json({ id: usernamePat._id,type:"Patient" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(usernamePharma){
      if (usernamePharma.Password === req.body.Password) {
        res.json({ id: usernamePharma._id,type:"Pharmacist" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(usernameAdm){
      if (usernameAdm.Password === req.body.Password) {
        res.json({ id: usernameAdm._id,type:"Admin" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }

   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,login
};
