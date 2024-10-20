const express = require("express")


const { protect } = require("../middleware/authmiddleware")
const { register_users, confirmEmail, login_users, updateUser, oneUser, getUser, landingpage, getallusers, forum_status, searchItems, landing_page, changePassword, logout_user } = require("../controller/users/users.controller")
const Router = express.Router()



//register users
Router.route("/register").post(register_users)
//login users 
Router.route("/login").post(login_users)
//logout a user
Router.route('/logout').post(protect, logout_user)


module.exports = Router