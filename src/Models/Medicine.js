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
      //keep both options
      type: String,
    },
    Image: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    Sales: {
      type: Number,
      default: 0,
    },
    Archived: {
      type: String,
      enum: ["Archive", "Unarchive"],
      default: "Archive",
    },
    Type: {
      type: String,
      enum: ["Prescription", "OTC"],
      default: "OTC",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
