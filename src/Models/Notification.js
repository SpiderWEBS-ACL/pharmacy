const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    Pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Pharmacist",
    },
    Medicine: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Medicine"
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
