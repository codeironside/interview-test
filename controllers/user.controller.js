const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const USER = require("../models/users/users");

/**
 * @api {post} /login Login User
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {Object} userWithoutPassword User object without password.
 * @apiSuccess {Number} referralCount Number of users referred by the user.
 * @apiSuccess {Array} referredUsers Array of users referred by the user.
 * @apiSuccess {String} token Authorization token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "userWithoutPassword": {
 *         "_id": "userId",
 *         "email": "user@example.com",
 *         // other user fields
 *       },
 *       "referralCount": 5,
 *       "referredUsers": [
 *         // array of user objects
 *       ],
 *       "token": "authorizationToken"
 *     }
 *
 * @apiError (400) FieldsEmpty Email and password cannot be empty.
 * @apiError (401) InvalidCredentials The provided credentials are invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "FieldsEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "InvalidCredentials"
 *     }
 */

const login_users = asynchandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Object.assign(new Error("Fields cannot be empty"), {
        statusCode: 400,
      });
    }
    const user = await USER.findOne({ email: email });
   
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
    
      const token = generateToken(user._id);
      const userWithoutPassword = await USER.findById(user.id).select(
        "-password"
      );
      res
        .status(200)
        .header("Authorization", `Bearer ${token}`)
        .json({
          ...userWithoutPassword._doc
        });

    } else {
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });
    }
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

/**
 * @api {post} /register Register User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} middleName User's middle name.
 * @apiParam {String} lastName User's last name.
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * @apiParam {String} userName User's username.
 * @apiParam {String} phoneNumber User's phone number.
 * @apiParam {String} referralCode Referral code of the user who referred this user.
 * @apiParam {String} pictureUrl URL of the user's picture.
 *
 * @apiSuccess {Object} userWithoutPassword User object without password.
 * @apiSuccess {Number} referralCount Number of users referred by the user.
 * @apiSuccess {Array} referredUsers Array of users referred by the user.
 * @apiSuccess {String} token Authorization token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 202 Accepted
 *     {
 *       "userWithoutPassword": {
 *         "_id": "userId",
 *         "email": "user@example.com",
 *         // other user fields
 *       },
 *       "referralCount": 5,
 *       "referredUsers": [
 *         // array of user objects
 *       ],
 *       "token": "authorizationToken"
 *     }
 *
 * @apiError (400) FieldsEmpty First name, last name, email, password, username, and phone number cannot be empty.
 * @apiError (409) UserExists User already exists.
 * @apiError (409) UserNameExists Username already exists.
 * @apiError InvalidReferralCode The provided referral code is invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "FieldsEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "UserExists"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "UserNameExists"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "InvalidReferralCode"
 *     }
 */
const register_users = asynchandler(async (req, res) => {
  try {
    const ip = req.ip;
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      userName,
      phoneNumber,

      role,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !userName ||
      !phoneNumber
    ) {
      throw Object.assign(new Error("Fields cannot be empty"), {
        statusCode: 400,
      });
    }

    const findEmail = await USER.findOne({ email: email });
    if (findEmail) {
      throw Object.assign(new Error("User already exists"), {
        statusCode: 409,
      });
    }

    const exist = await USER.findOne({ userName: userName });
    if (exist)
      throw Object.assign(new Error("User Name already exists"), {
        statusCode: 409,
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUsers = await USER.create({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      userName,
      phoneNumber,  
      role,
    
    });
    const token = generateToken(createUsers._id);

    res
      .status(202)
      .header("Authorization", `Bearer ${token}`)
      .json({
        ...userWithoutPassword._doc,
        referredUsers,
      });
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
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
    { expiresIn: "48h" }
  );
};

const logout_user = asynchandler(async (req, res) => {
  try {
    const { id } = req.auth;
    res.status(200).header("Authorization", null).json({
      message: "Logged out successfully",
    });
    logger.info(
      `user with id ${id} logged out at ${currentDateTimeWAT.toString()} - ${
        res.statusCode
      } - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

module.exports = {
  register_users,
  login_users,
  logout_user,
};
