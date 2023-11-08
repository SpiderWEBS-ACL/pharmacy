const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    wallet: {
        type: Number,
        default: 0,
    },
    shippingAddresses: [
        {
            shippingAddress: {
                type: String,
                default: "no shipping address"
            }
        }
    ]
});

module.exports = mongoose.model("Config", configSchema);