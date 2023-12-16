const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    Pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacist",
    },
    Medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine"
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true
    },
    opened: {
      type: Boolean,
      default: false
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
