const Cart = require("../Models/Cart");
const Medicine = require("../Models/Medicine");
const mongoose = require("mongoose");

const createCart = async (req, res) => {
    try {
      // Create a new cart
      const cart = new Cart();
      await cart.save();
  
      return res.status(201).json(cart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

// Add a medicine to the cart
// Add a medicine to the cart with a specified quantity
const addMedicineToCart = async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const medicineId = req.params.medicineId;
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }
  
      // Check if the medicine already exists in the cart
      const existingMedicine = cart.medicines.find((m) => m.medicine.toString() === medicineId);
  
      if (existingMedicine) {
        // Update the quantity of the existing medicine
        existingMedicine.quantity -= 1;
      } else {
        // Add the medicine to the cart
        cart.medicines.push({ medicine: medicineId });
      }
  
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  // Update the quantity of a medicine in the cart
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
  
      // Check if the requested quantity exceeds the available quantity in stock
      if (quantity > medicine.Quantity) {
        return res.status(400).json({ error: "Requested quantity exceeds available stock" });
      }
  
      // Update the quantity in the cart
      medicineInCart.quantity = quantity;
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  

// Remove a medicine from the cart
const removeMedicine = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const medicineId = req.params.medicineId;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the index of the medicine to remove
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

    // Remove the medicine from the cart
    cart.medicines.splice(index, 1);
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// View the contents of the cart
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

// View details of a specific medicine in the cart
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

module.exports = {
    createCart,
  addMedicineToCart,
  removeMedicine,
  viewCart,
  viewMedicineDetailsInCart,
  updateMedicineQuantity
};
