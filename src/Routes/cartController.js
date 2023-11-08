const Cart = require("../Models/Cart");
const Medicine = require("../Models/Medicine");
const Patient = require("../Models/Patient");

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
      const cartId = req.user.Cart;
      const medicineId = req.params.medicineId;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }
      else if(medicine.Quantity < 1){
        return res.status(404).json({ error: "Medicine is out of stock" });
      }
      const updatedMedicine = await Medicine.findByIdAndUpdate(medicineId, {Quantity: medicine.Quantity - 1})
      const existingMedicine = cart.medicines.find((m) => m.medicine.toString() === medicineId);
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
      const cartId = req.params.cartId;
      const medicineId = req.params.medicineId;
      const quantity = req.body.quantity;
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be greater than 0" });
      }
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      const medicineInCart = cart.medicines.find((m) => m.medicine.toString() === medicineId);
      if (!medicineInCart) {
        return res.status(404).json({ error: "Medicine not found in the cart" });
      }
  
      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }
      if (quantity > medicine.Quantity) {
        return res.status(400).json({ error: "Requested quantity exceeds available stock" });
      }

      medicineInCart.quantity = quantity;
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

const removeMedicine = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const medicineId = req.params.medicineId;

    const cart = await Cart.findById(cartId);
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

    const cart = await Cart.findById(cartId).populate("medicines");
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
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId)
    const cartId = patient.Cart;
    console.log(cartId)
    

    const cart = await Cart.findById(cartId).populate("medicines");
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

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    return res.status(200).json(medicine);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

  const checkoutWithCard = async (req, res) => {
    
  }
module.exports = {
    createCart,
  addMedicineToCart,
  removeMedicine,
  viewCart,
  viewMedicineDetailsInCart,
  updateMedicineQuantity,
  viewPatientCart
};
