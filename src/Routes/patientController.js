const patientModel = require("../Models/Patient");
const orderModel= require("../Models/Orders");
const medicineModel= require("../Models/Medicine");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//---------------------------------------REGISTRATION-----------------------------------------------

const Cart = require("../Models/Cart");
const Patient = require("../Models/Patient");


const registerPatient = async (req, res) => {
  try {
    const exists = await Patient.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await Patient.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });

    if (!exists && !exists2) {
      // Create a new patient
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      const newPatient = await Patient.create(req.body);

      // Create a new cart for the patient
      const cart = new Cart();
      await cart.save();

      // Associate the cart with the patient
      newPatient.Cart = cart._id;
      await newPatient.save();

      res.status(201).json(newPatient);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const PatientInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const changePasswordPatient = async (req, res) => {
  try {
    const { id } = req.user;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res.status(404).json({ error: "Please fill out all required fields" });
    }

    //find patient to update password
    const patient = await patientModel.findById(id);

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, patient.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

     //new password same as old
     if(await bcrypt.compare(newPass, patient.Password)){
      return res.status(400).json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    const newPatient = await patientModel.findByIdAndUpdate(id, { Password: hashedPass }, {new:true});

    res.status(200).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewPatientOrder = async (req, res) => {
  try {
    const OrderId = req.params.id;
    console.log(OrderId)
 
    const Order = await orderModel.findById(OrderId).populate("Medicines.medicine");
    if (!Order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(Order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
const cancelOrder = async (req,res) => {
  try {
    const {id} = req.params;
    const order = await orderModel.findById(id);
    if(order.Status == "Shipped"){
      return res.status(400).json({error: "Order is already shipped, you can not cancel"});
    }
    await order.updateOne({Status:"Cancelled"},{new:true});
    const medicines = order.Medicines;
    for (let i = 0; i < medicines.length; i++) {
      const medicineId = medicines[i].medicine.toString();
      const medicine = await medicineModel.findById(medicineId);
      await medicine.updateOne({Quantity: medicine.Quantity + medicines[i].Quantity})
    }
    //refunding in case using card
    res.status(200).json(order);
  }

  catch(error) {
    res.status(500).json({ error: error.message });
  }

}
const choosedeliveryaddress = async (req,res) => {
  try {
    const {id} = req.body;
    const order = await orderModel.findById(id);
    order.updateOne({DeliveryAddress});
    
}
catch (error){
  res.status(500).json({ error: error.message });
}
}

//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,
  PatientInfo,
  viewPatientOrder,
  viewWallet,
  viewShippingAdresses,
  addShippingAddress,
  changePasswordPatient,
  cancelOrder,
};
