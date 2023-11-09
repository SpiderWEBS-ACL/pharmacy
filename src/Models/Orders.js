const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    Patient: { 
        type: Schema.Types.ObjectId, 
        ref: "Patient", 
        required: true 
    },
    Medicines: [
      {
        medicine: {
          type: Schema.Types.ObjectId,
          ref: "Medicine",
        },
        Quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    TotalPrice: {
      type: Number,
      required: true,
    },
    DeliveryAddress: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["Processing", "Shipped", "Cancelled"],
      default: "Pending ",
    },
    PaymentMethod: {
      type: String,
      enum: ["Wallet", "Credit Card", "Cash On Delivery"],
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);

