const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  medicines: [
    {
      medicine: {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
      },
      quantity: {
        type: Number, // Use "Number" to define quantity as an integer
        default: 1, // Optional: You can set a default value, such as 1
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
