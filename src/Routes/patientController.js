const patientModel = require("../Models/Patient");
const medicineModel = require("../Models/Medicine");
const { default: mongoose } = require("mongoose");
const Patient = require("../Models/Patient");
const Orders = require("../Models/Orders");
const { json } = require("body-parser");

//---------------------------------------REGISTRATION-----------------------------------------------

const registerPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({"Username" : req.body.Username});
    const exists2 = await patientModel.findOne({"Email" : req.body.Email});
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
cosnt cancelorder = async (req,res) => {
  const cld = req.query.id;
  OrdersModel.findByldAndUpdate({status:mongoose.Type.Objectld(json.Orders)}) //make order status = "cancelled"

}
const choosedeliveryaddress = async (req,res) => {
  const selectedadd = OrdersModel.findByld; //find addresses
  Orders.DeliveryAddress = selectedadd; //the selected address be the delivery address
  if (!selectedadd){
    res.status(400).json({"No delivery address selected"}); //error message for not choosing the delivery address
  }
}
const viewWallet = async (req,res) => {
  try{
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient.Wallet)

  }catch (error) {
    res.status(500).json({ error: error.message });
  }
  
}
const viewShippingAdresses = async (req,res) => {
  try{
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient.shippingAddresses)
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const addShippingAddress = async (req, res) => {
  try {
    const shipping = req.body.address;
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }

    patient.shippingAddresses.push(shipping);
    await patient.save();
    
    return res.status(200).json({ message: "Shipping address added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const payCartWithWallet  = async(req,res) => {
 


}
//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,cancelorder,choosedeliveryaddress,
};
