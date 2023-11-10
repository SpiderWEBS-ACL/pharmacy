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

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,cancelorder,choosedeliveryaddress,
};
