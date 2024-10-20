const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authmiddleware");

const {
  makecart,
  updateCart,
  getOneCart,
  getAllcartsForuser,
} = require("../controllers/cart.controller");

//access private
Router.route("/create").post(protect, makecart);
//ccess privare

Router.route("/user").get(protect, getAllcartsForuser);

//access private
Router.route("/updatebooking/:cart_id").put(protect, updateCart);

Router.route("/one/:cartId").put(protect, getOneCart);

module.exports = Router;
