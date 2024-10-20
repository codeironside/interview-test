const asynchandler = require("express-async-handler");
const COFFEE = require("../../model/shops/shop");

const USER = require("../../model/users/user.js");
const jwt = require("jsonwebtoken");
const users = require("../models/users/users.js");

const create_coffee = asynchandler(async (req, res) => {
  try {
    const { id } = req.auth;

    if (!id) throw Object.assign(new Error("Not a user"), { statusCode: 404 });

    const user = await USER.findById(id);
    if (!user)
        throw Object.assign(new Error("Not a user"), { statusCode: 404 });
    if (user.role !== "admin")
        throw Object.assign(new Error("unauthorized, not an admin"), {statusCode:403})

    const { coffee_name, address, keywords, images, price, description } =
      req.body;
    const createShops = await COFFEE.create({
      owner: id,
      coffee_name,
      address,
      contact_email: user.email,
      contact_number: user.phoneNumber,
      keywords,
      images,
      description,
      price: Number(price),
    });

    if (createShops) {
      res.status(200).json({
        createShops,
        newWorkingHours,
      });
    }
  } catch (error) {
    console.error(error);

    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

const getOneCoffee = asynchandler(async (req, res) => {
  const { COFFEE_ID } = req.params;
  if (!COFFEE_ID) {
    throw Object.assign(new Error("Not  found"), { statusCode: 404 });
  }
  try {
    const coffee = await COFFEE.findById(SHOP_ID);
    if (coffee) {
      res.status(200).json({
        ...shop._doc,
      });
   
    }
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});


const getallcoffee = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  try {

      const totalCount = await COFFEE.countDocuments();
      const totalPages = Math.ceil(totalCount / pageSize);
      const coffees = await COFFEE.find()
          .skip((page - 1) * pageSize)
          .limit(pageSize);
      res.status(200).json({
          owner: owner,
          data:coffees,
          page: page,
          totalPages: totalPages,
      });
  } catch (error) {
    console.log(error);
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});


const updatecoffee = asynchandler(async (req, res) => {
  const { coffeeId } = req.params; // Get the shop ID from the route parameters
  const clientIp = req.ip;

  const updateData = req.body; // Get the updated data from the request body
  const { id } = req.auth;
  try {
    if (!coffeeId) {
      throw Object.assign(new Error("coffee id is empty"), {
        statusCode: 400,
      });
    }

    if (!updateData) {
      throw Object.assign(new Error("update data is em pty"), {
        statusCode: 400,
      });
    }

    const coffee= await COFFEE.findById(coffeeId);

    if (!coffee) {
      throw Object.assign(new Error("shop not found"), {
        statusCode: 404,
      });
    }
const user = await users.findById(id)
    if (
      !(
        user.role==="admin"
      )
    ) {
      throw Object.assign(new Error("not authorized"), {
        statusCode: 403,
      });
    }
    const updatedcoffee = await COFFEE.findByIdAndUpdate(shopId, updateData, {
      new: true, // Return the updated shop document
    });

    if (!updatedcoffee) {
      throw Object.assign(new Error("error updating shop"), {
        statusCode: 404,
      });
    }
    const token = generateToken(id);
    res.status(202).header("Authorization", `Bearer ${token}`).json({
      successful: true,
      data: updatedcoffee,
    });
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});



const deletecoffee = asynchandler(async (req, res) => {
  const { coffeeId } = req.params;
  const { id } = req.auth;

  try {
    if (!coffeeId) {
      throw Object.assign(new Error("Shop ID is empty"), {
        statusCode: 400,
      });
    }

    const coffee = await COFFEE.findById(shopId);
    if (!coffee) {
      throw Object.assign(new Error("Shop not found"), {
        statusCode: 404,
      });
    }

      const user = await users.findById(id)
      if (
          !(
              user.role === "admin"
          )
      ) {
          throw Object.assign(new Error("not authorized"), {
              statusCode: 403,
          }
        }
    const deletedShop = await COFFEE.findByIdAndDelete(shopId);

    if (!deletedShop) {
      throw Object.assign(new Error("Error deleting shop"), {
        statusCode: 500,
      });
    }
    res.status(200).json({
      success: true,
    });

  } catch (error) {
    throw Object.assign(new Error("Banned from forum"), {
      statusCode: error.statusCode,
    });
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
};
