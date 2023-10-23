const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Dob: {
      type: Date,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    Mobile: {
      type: Number,
      required: true,
    },
    EmergencyContact: {
      Name: {
        type: String,
        required: false,
      },

      Mobile: {
        type: Number,
        required: false,
      },

      relationToPatient: {
        //no limitations mentioned so no ENUM
        type: String,
        required: false,
      },
    },
    Cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
