const patientModel = require("../Models/Patient");
const orderModel = require("../Models/Orders");
const medicineModel = require("../Models/Medicine");
const pharmacistModel = require("../Models/Pharmacist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//---------------------------------------REGISTRATION-----------------------------------------------

const Cart = require("../Models/Cart");
const Patient = require("../Models/Patient");
const Medicine = require("../Models/Medicine");

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
      return res
        .status(404)
        .json({ error: "Please fill out all required fields" });
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
    if (await bcrypt.compare(newPass, patient.Password)) {
      return res
        .status(400)
        .json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    const newPatient = await patientModel.findByIdAndUpdate(
      id,
      { Password: hashedPass },
      { new: true }
    );

    res.status(200).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllOrders = async (req, res) => {
  try {
    const { id } = req.user;

    const orders = await orderModel
      .find({ Patient: id })
      .populate("Medicines.medicine");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeAllOrders = async (req, res) => {
  try {
    // const {id} = req.user;
    await orderModel.deleteMany({});
    res.status(200).json("Orders Deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewPatientOrder = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.user._id);
    const order = await orderModel
      .findById(id)
      .populate("Medicines.medicine")
      .populate("Patient")
      .populate({
        path: "Medicines.medicine",
        populate: { path: "Image" },
      });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.Patient._id.equals(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You are not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewWallet = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient.Wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const viewShippingAdresses = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    res.status(200).json(patient.shippingAddresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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

    return res
      .status(200)
      .json({ message: "Shipping address added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    // console.log(req);
    const { id } = req.params;
    const order = await orderModel.findById(id).populate("Patient");

    const patient = order.Patient;

    if (!patient) {
      return res.status(404).json("Patient Not Found");
    }

    if (order.Status == "Shipped") {
      return res
        .status(400)
        .json({ error: "Order is already shipped, you can not cancel it" });
    }

    if (order.Status == "Cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    //return medicines to stock
    const medicines = order.Medicines;

    for (let i = 0; i < medicines.length; i++) {
      const medicineId = medicines[i].medicine.toString();
      const medicine = await medicineModel.findById(medicineId);
      await medicine.updateOne({
        Quantity: medicine.Quantity + medicines[i].quantity,
        Sales: medicine.Sales - medicines[i].quantity,
      });
    }

    //refunding in wallet
    if (order.PaymentMethod != "Cash On Delivery") {
      patient.Wallet += order.TotalPrice;
      await patient.save();
    }

    //change status
    await order.updateOne({ Status: "Cancelled" }, { new: true });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPharmacists = async (req, res) => {
  try {
    const Doctors = await pharmacistModel.find({});
    return res.status(200).json(Doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//---------------------------------------EXPORTS-----------------------------------------------

module.exports = {
  registerPatient,
  PatientInfo,
  viewPatientOrder,
  viewWallet,
  viewShippingAdresses,
  addShippingAddress,
  changePasswordPatient,
  viewAllOrders,
  removeAllOrders,
  cancelOrder,
  getAllPharmacists,
};
