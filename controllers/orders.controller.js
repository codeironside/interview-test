const Cart = require("../models/carts/carts");
const asynchandler = require("express-async-handler");
const USERS = require("../models/users/users");

const getUserOrder = asynchandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.auth;

    const order = await Cart.findOne({ _id: orderId, user: userId }).populate(
      "items.product",
      "product_name"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving order", error: error.message });
  }
});

const getAllUserOrders = asynchandler(async (req, res) => {
  try {
    const userId = req.auth; // Assuming user ID is set in req.user

    const orders = await Cart.find({ user: userId }).populate(
      "items.product",
      "product_name"
    );

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
  }
});

const getAllOrders = asynchandler(async (req, res) => {
  try {
    const userId = req.auth;
    const user = await users.findById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Cart.find()
      .populate("user", "user_name")
      .populate("items.product", "product_name");

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving all orders", error: error.message });
  }
});

const updateOrderStatus = asynchandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paid } = req.body;

    const userId = req.auth;
    const user = await USERS.findById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedOrder = await Cart.findByIdAndUpdate(
      orderId,
      { paid },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
});



module.exports = {
    getAllOrders,
    getAllUserOrders,
    updateOrderStatus,
    getUserOrder
}
