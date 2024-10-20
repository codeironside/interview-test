const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const {
  create_coffee,
  getallcoffee,
  getOneCoffee,
  updatecoffee,
  deletecoffee,
} = require("../controllers/coffee.controller");

//access private
Router.route("/register").post(protect, create_coffee);
//ccess privare
Router.route("/getall").get(getallcoffee);

//acess private for a guesst
Router.route("/onecoffee/:COFFEE_ID").get(getOneCoffee);

//access private
Router.route("/updateS/:coffeeId").put(protect, updatecoffee);

Router.route("/delete/:coffeeId").delete(protect, deletecoffee);
module.exports = Router;
