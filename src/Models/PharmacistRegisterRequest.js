const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistRegisterSchema = new Schema(
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
    HourlyRate: {
      type: Number,
      required: true,
    },
    Affiliation: {
      type: String,
      required: true,
    },
    EducationalBackground: {
      type: String,
      required: true,
    },
    PersonalID:{
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    PharmacyDegree:{
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    WorkingLicenses:[{
      type: Schema.Types.ObjectId,
      ref: "File",
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacistRegister", pharmacistRegisterSchema);
