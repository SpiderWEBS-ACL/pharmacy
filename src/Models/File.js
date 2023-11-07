const mongoose = require("mongoose");
const multer = require('multer');

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    Pharmacist: {
      type: Schema.Types.ObjectId,
      ref: "Pharmacist",
      required: true,
    },
    filename:{
        type: String,
        required: true
    },
    originalname:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    }
  }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;