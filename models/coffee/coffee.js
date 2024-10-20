const mongoose = require("mongoose");

const coffee = new mongoose.Schema(
    {
        coffee_name: {
            type: String,
            required: [true, "please add a coffee name"],
            unique: true,
        },
        address: {
            type: String,

        },

        keywords: {
            type: String,
        },
  
        images: {
            type: String,
        },

        description: { type: String },
     

        owner: {
            type: mongoose.Schema.ObjectId,
            required: [true, "please include an owners Id"],
            ref: "USER",
        },
        contact_number: {
            type: String,
            required: [true, "please include a contact number"],
        },
        contact_email: {
            type: String,
            required: [true, "please include a contact email"],
        },

        price: {
            type: Number,
            default: 0,
        },
        availabilty: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("coffee", coffee);

