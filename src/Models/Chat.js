const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    Patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: false
    },
    Pharmacist: {
        type: Schema.Types.ObjectId,
        ref: "Pharmacist",
        required: false
    }

},{ timestamps: true }
)
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;