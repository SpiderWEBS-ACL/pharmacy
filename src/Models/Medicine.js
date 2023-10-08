const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: false,
    },
    Price: {
      type: Number,
      required: true,
    },
    ActiveIngredients: {
      type: [String],
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
    },
    MedicinalUse: {
      type: String,
      required: false,
    },
    imageURL: {
      type: String,
      required: false,
    },
    Sales: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
