const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    phone: {
        type: String,
        required: true
    },

    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Order", orderSchema);