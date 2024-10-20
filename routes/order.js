const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const {
  updateOrderStatus,
  getAllOrders,
  getAllUserOrders,
  getUserOrder,
} = require("../controllers/orders.controller");

//access private
Router.route("/getalusersorders").get(protect, getAllUserOrders);
//ccess privare

Router.route("/getoneorder/:id").get(protect, getUserOrder);

//access private
Router.route("/admin/orders/:id").put(protect, updateOrderStatus);

Router.route("/admin/getorders/:id").get(protect, getAllOrders);

module.exports = Router;
