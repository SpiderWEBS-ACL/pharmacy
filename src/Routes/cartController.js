const { config } = require("dotenv");
const Cart = require("../Models/Cart");
const Medicine = require("../Models/Medicine");
const Patient = require("../Models/Patient");
const Orders = require("../Models/Orders");
const prescriptionModel = require("../Models/Prescription");
const Notification = require("../Models/Notification");
const Pharmacist = require("../Models/Pharmacist");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");


const createCart = async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();

    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addMedicineToCart = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    const cartId = patient.Cart;

    const cart = await Cart.findById(cartId).populate("medicines");
    const medicineId = req.params.medicineId;

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    } else if (medicine.Quantity < 1) {
      return res.status(404).json({ error: "Medicine is out of stock" });
    }
    const updatedMedicine = await Medicine.findByIdAndUpdate(medicineId, {
      Quantity: medicine.Quantity - 1,
    });
    const existingMedicine = cart.medicines.find(
      (m) => m.medicine.toString() === medicineId
    );
    if (existingMedicine) {
      existingMedicine.quantity += 1;
    } else {
      cart.medicines.push({ medicine: medicineId });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateMedicineQuantity = async (req, res) => {
  try {
    const patientId = req.user;
    const patient = await Patient.findById(patientId);
    const cartId = patient.Cart;

    const cart = await Cart.findById(cartId).populate("medicines");
    const medicineId = req.params.medicineId;
    const updateQuantity = req.body.quantity;
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const medicineInCart = cart.medicines.find(
      (m) => m.medicine.toString() === medicineId
    );
    if (!medicineInCart) {
      return res.status(404).json({ error: "Medicine not found in the cart" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    if (medicine.Quantity == 0) {
      return res
        .status(400)
        .json({ error: "Requested quantity exceeds available stock" });
    }
    if (medicineInCart.quantity === 1 && updateQuantity === -1) {
      return res.status(400).json({ error: "min quantity in cart" });
    }

    medicineInCart.quantity += updateQuantity;
    await cart.save();
    medicine.Quantity -= updateQuantity;
    await medicine.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    console.log(patientId);

    const cartId = patient.Cart;
    const cart = await Cart.findById(cartId).populate("medicines");
    console.log(cartId);

    const meds = [];
    cart.medicines = meds;

    await cart.save();

    return "Cart Emptied";
  } catch (error) {
    throw error;
  }
};

const removeMedicine = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    const cartId = patient.Cart;
    const cart = await Cart.findById(cartId).populate("medicines");
    const medicineId = req.params.medicineId;

    var medicine = await Medicine.findById(medicineId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let index = -1;
    for (let i = 0; i < cart.medicines.length; i++) {
      if (cart.medicines[i].medicine.toString() === medicineId) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return res.status(404).json({ error: "Medicine not found in the cart" });
    }

    medicine = await Medicine.findById(cart.medicines[index].medicine);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    medicine.Quantity += cart.medicines[index].quantity;

    await medicine.save();

    cart.medicines.splice(index, 1);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const cart = await Cart.findById(cartId)
      .populate("medicines")
      .populate("medicines.medicine.Image");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const viewPatientCart = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);
    const cartId = patient.Cart;

    const cart = await Cart.findById(cartId)
      .populate("medicines")
      .populate("medicines.medicine.Image");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewMedicineDetailsInCart = async (req, res) => {
  try {
    const medicineId = req.params.medicineId;

    const medicine = await Medicine.findById(medicineId).populate("Image");
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    return res.status(200).json(medicine);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getCartTotal = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    const cartId = patient.Cart;
    const cart = await Cart.findById(cartId).populate("medicines");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let total = 0;

    for (const item of cart.medicines) {
      const medicineId = item.medicine;
      const medicine = await Medicine.findById(medicineId);

      if (!medicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }

      total += item.quantity * medicine.Price;
    }

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getCartTotalHelper = async (req, res) => {
  const patientId = req.user;
  const patient = await Patient.findById(patientId);
  const cartId = patient.Cart;
  const cart = await Cart.findById(cartId).populate("medicines");

  if (!cart) {
    return 0;
  }

  let total = 0;

  for (const item of cart.medicines) {
    const medicineId = item.medicine;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return 0;
    }
    total += item.quantity * medicine.Price;
  }
  return total;
};

const getCartTotalHelper2 = async (req, res) => {
  const patientId = req.id;
  const patient = await Patient.findById(patientId);
  const cartId = patient.Cart;
  const cart = await Cart.findById(cartId).populate("medicines");

  if (!cart) {
    return 0;
  }

  let total = 0;

  for (const item of cart.medicines) {
    const medicineId = item.medicine;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return 0;
    }
    total += item.quantity * medicine.Price;
  }

  return total;
};

const payCartWithWallet = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    total = await getCartTotalHelper2({ id: patientId });
    console.log("TOTAL:", total);
    patient.Wallet -= total;
    await patient.save();

    const order = await placeOrder(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payCartWithStripe = async (req, res) => {
  try {
    const shipping = req.body.shipping;

    const total = await getCartTotalHelper(req, res);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", //or subscription
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Cart" },
            unit_amount: total * 100, //In cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SERVER_URL}/patient/success?shipping=${shipping}`,
      cancel_url: `${process.env.SERVER_URL}/patient/cancel`,
      // metadata: {shipping}
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { shipping, paymentMethod } = req.body;

    const patient = await Patient.findById(id);

    const cartId = patient.Cart;
    const cart = await Cart.findById(cartId);

    const medicines = cart.medicines;

    console.log(medicines);

    //update sales
    for (let i = 0; i < medicines.length; i++) {
      const medicineId = medicines[i].medicine.toString();
      const medicine = await Medicine.findById(medicineId);

      console.log(medicine);

      await medicine.updateOne( {Sales: medicine.Sales + medicines[i].quantity})

      //out of stock
      if (medicine.Quantity == 0){

        const pharmacists = await Pharmacist.find({});

        for(let i = 0; i < pharmacists.length; i++){

          await sendNotification(pharmacists[i].Email, medicine);
        
        }
      }
    }

    const total = await getCartTotalHelper(req, res);

    const order = await Orders.create({
      Patient: patient,
      Medicines: medicines,
      TotalPrice: total,
      Status: "Processing",
      DeliveryAddress: shipping,
      PaymentMethod: paymentMethod,
      Date: Date.now(),
    });

    console.log("Order Placed");
    await emptyCart(req, res);

    console.log("Cart Emptied");

    res
      .status(200)
      .json({
        url: `${process.env.SERVER_URL}/patient/viewOrder/${order._id}`,
      });

    console.log("returned");
  } catch (error) {
    throw error;
  }
};


const sendNotification = async (pharmacist, medicine) => {
// const sendNotification = async (req, res) => {
  // const {pharmacistId, medicineId} = req.body;
  try {

    // const pharmacist = await Pharmacist.findById(pharmacistId);
    // const medicine = await Medicine.findById(medicineId);

    const viewMedicinePage = `http://localhost:5173/pharmacist/medicineDetails/${medicine._id}`;


    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

//<img src= ${ medicine.Image? `/images/${medicine.Image.filename}` :medicine.imageURL} width={100} height={100}/>

    //format email details
    const mailOptions = {
      from: "spiderwebsacl@gmail.com",
      to: pharmacist.Email,
      subject: "New Notification",
      html: ` <img src= ${ medicine.Image? `/images/${medicine.Image.filename}` :medicine.imageURL} width="50" height="50"/> <a style="font-size:20px; letter-spacing:2px;" href= ${viewMedicinePage}> <b><i> ${medicine.Name}</i></b></a>
              <p>is out of stock and needs to be refilled.</p>`,
    };

    //send email
    transporter.sendMail(mailOptions);

    const notif = await Notification.create({
      Pharmacist: pharmacist,
      Medicine: medicine,
      message: `${medicine.Name} is out of stock!`,
      date: Date.now()
    });

    return notif;

    // res.status(200).json(notif);
  
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createCart,
  addMedicineToCart,
  removeMedicine,
  viewCart,
  viewMedicineDetailsInCart,
  updateMedicineQuantity,
  viewPatientCart,
  getCartTotal,
  payCartWithStripe,
  emptyCart,
  payCartWithWallet,
  placeOrder,
  sendNotification,
};
