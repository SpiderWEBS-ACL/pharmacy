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
      required: true,
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
      required: true,
    },
    imageURL: {
      type: String,
      required: false,
    },
    Sales: {
        type: Number,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
