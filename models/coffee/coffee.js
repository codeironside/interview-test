const mongoose = require("mongoose");

const coffee = new mongoose.Schema(
    {
        shop_name: {
            type: String,
            required: [true, "please add a shop name"],
            unique: true,
        },
        shop_address: {
            type: String,

        },

        keywords: {
            type: String,
        },
        google_maps_place_id: {
            type: String,
        },
 
        images: {
            type: String,
        },

        description: { type: String },
        website: { type: String },
        instant_booking: { type: String },
        category: {
            type: String,
            required: [true, "please add a category"],
        },
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
        approved: {
            type: Boolean,
            default: false,
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

