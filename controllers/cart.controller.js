const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const USER = require("../models/users/users");
const COFFEE = require("../models/coffee/coffee");
const cart = require("../models/carts/carts");


const makecart = asynchandler(async (req, res) => {
    try {
        const { id } = req.auth;
        let { items } = req.body;
        if (!id) throw Object.assign(new Error("Not allowed"), { statusCode: 403 });
        const user = await USER.findById(id);
        if (!user)
            throw Object.assign(new Error("Not a user"), { statusCode: 404 });
        let totalAmount = 0;
        if (typeof items === "string") {
            items = JSON.parse(items);
        }
        for (item of items) {
            const shop = await COFFEE.findById(item.shop_id);
            console.log(item);
            if (!shop)
                throw Object.assign(new Error("No shops found"), { statusCode: 404 });
            if (shop.category === "barbers")
                throw Object.assign(new Error("carting only reserved for babers"), {
                    statusCode: 403,
                });
            item.amount = item.quantity * shop.price;
            totalAmount += item.amount;
            item.product = shop._id;
            item.product_name = shop.shop_name;
            item.image = shop.images;
        }

        const book = await cart.create({
            user: user._id,
            user_name: user.userName,
            items,
            totalAmount,
        });

        if (book) {
            const token = generateToken(user._id);
            res.status(201).header("Authorization", `Bearer ${token}`).json({
                book,
            });

        }
    } catch (error) {
        throw Object.assign(new Error(`${error}`), {
            statusCode: error.statusCode,
        });
    }
});

const updateCart = asynchandler(async (req, res) => {
    try {
        const { id } = req.auth;
        let { items } = req.body;
        let { cart_id } = req.params;
        const user = await USER.findById(id);

        if (!user) {
            throw Object.assign(new Error("User not found"), { statusCode: 404 });
        }

        if (typeof items === "string") {
            items = JSON.parse(items);
        }

        if (!items || !Array.isArray(items)) {
            throw Object.assign(new Error("Invalid items format"), {
                statusCode: 400,
            });
        }

        const userCart = await cart.findById(cart_id);

        if (userCart && userCart.paid === false) {
            let existingItems = userCart.items;

            for (const item of items) {
                const { shop_id, quantity } = item;

                const shop = await COFFEE.findById(shop_id);
                if (!shop) {
                    throw Object.assign(new Error("Shop not found"), { statusCode: 404 });
                }

                const existingProductIndex = existingItems.findIndex(
                    (existingItem) => existingItem.product.toString() === shop_id
                );

                if (existingProductIndex !== -1) {
                    existingItems[existingProductIndex].quantity += quantity;
                    existingItems[existingProductIndex].amount += quantity * shop.price;
                } else {
                    existingItems.push({
                        product: shop_id,
                        product_name: shop.shop_name,
                        quantity,
                        amount: quantity * shop.price,
                        image: shop.images,
                    });
                }
            }

            const totalAmount = existingItems.reduce(
                (total, item) => total + item.amount,
                0
            );

            userCart.items = existingItems;
            userCart.totalAmount = totalAmount;
            await userCart.save();

            const token = generateToken(id);
            res
                .status(200)
                .header("Authorization", `Bearer ${token}`)
                .json({
                    updatedCart: userCart,
                });

            logger.info(
                `Cart updated for user with ID: ${id} - Cart ID: ${cart_id} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
            );
        } else {
            const newCart = new cart({
                user: id,
                user_name: user.userName,
                items: items.map(item => ({
                    product: item.shop_id,
                    quantity: item.quantity,
                    // You may need to fetch shop details from DB to set other item properties like amount, product_name, image, etc.
                })),
                // You may need to calculate the totalAmount for the new cart based on the items added
            });
            await newCart.save();

            const token = generateToken(id);
            res
                .status(201)
                .header("Authorization", `Bearer ${token}`)
                .json({
                    newCart,
                });

            logger.info(
                `New cart created for user with ID: ${id} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
            );
        }
    } catch (error) {
        throw Object.assign(new Error(`${error}`), {
            statusCode: error.statusCode || 500,
        });
    }
});






const getAllcartsForuser = asynchandler(async (req, res) => {
    try {
        const { id } = req.auth;
        const user = await USER.findById(id);
        if (
            id !== user._id.toString()
        )
            throw Object.assign(new Error("Not authorized"), { statusCode: 403 });
        let carts = await cart.find({ user: id }).populate({
            path: "items.product",
            model: "COFFEE",
            populate: {
                path: "owner",
                model: "USER",
                select: "firstName email number address",
            },
            select: "shop_name contact_email shop_address images contact_number",
        });

        const token = generateToken(id);

        res.status(200).header("Authorization", `Bearer ${token}`).json({
            carts,
        });


    } catch (error) {
        throw Object.assign(new Error(`${error}`), {
            statusCode: error.statusCode,
        });
    }
});



const getOneCart = asynchandler(async (req, res) => {
    try {
        const { cartId } = req.params;
        const { id } = req.auth;

        // Fetch the user
        const user = await USER.findById(id);
        if (!user) {
            throw Object.assign(new Error("User not found"), { statusCode: 404 });
        }

        // Find the cart by ID
        const foundCart = await cart.findById(cartId)
            .populate({
                path: "items.product",
                model: "COFFEE",
            })
            .populate({
                path: "user",
                model: "USER",
                select: "firstName userName email number",
            });

        // Check if the cart belongs to the user or if the user is an admin/superadmin
        if (
            !foundCart ||
            (id !== foundCart.user.toString())
        ) {
            throw Object.assign(new Error("Not authorized to view this cart"), { statusCode: 401 });
        }

        const token = generateToken(id);

        res.status(200).header("Authorization", `Bearer ${token}`).json({
            foundCart,
        });

        logger.info(
            `Cart retrieved for user with ID: ${id} - Cart ID: ${cartId} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
    } catch (error) {
        throw Object.assign(new Error(`${error}`), {
            statusCode: error.statusCode || 500,
        });
    }
});


const getLocation = asynchandler(async (ip) => {
    try {
        // Set endpoint and your access key
        const accessKey = process.env.ip_secret_key;
        const url =
            "http://apiip.net/api/check?ip=" + ip + "&accessKey=" + accessKey;

        // Make a request and store the response
        const response = await fetch(url);

        // Decode JSON response:
        const result = await response.json();

        // Output the "code" value inside "currency" object
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
});

const generateToken = (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );
};
module.exports = {
    makecart,
    updateCart,
    getAllcartsForuser,
    getOneCart,
};