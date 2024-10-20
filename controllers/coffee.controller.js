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


 * @api {post} /login Login Shop
 * @apiName LoginShop
 * @apiGroup Shop
 *
 * @apiParam {String} SHOP_ID ID of the shop to login.
 *
 * @apiSuccess {Boolean} successful Indicates whether the login was successful.
 * @apiSuccess {Object} data Shop object.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "successful": true,
 *       "data": {
 *         "_id": "shopId",
 *         "name": "shopName",
 *         // other shop fields
 *       }
 *     }
 *
 * @apiError (404) NoShopsFound No shops were found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "NoShopsFound"
 *     }
 */
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



//   try {
//     const shops = await COFFEE.find({ isApproved: true, hasConsented: true });
//     const payments = await PAYMENTS.aggregate([
//       { $group: { _id: "$shop_id", count: { $sum: 1 } } }
//     ]);

//     // Convert payments to a map for faster lookup
//     const paymentMap = {};
//     payments.forEach(payment => {
//       paymentMap[payment._id.toString()] = payment.count;
//     });

//     // Add payment count to each shop
//     shops.forEach(shop => {
//       shop.paymentCount = paymentMap[shop._id.toString()] || 0;
//     });

//     res.status(200).json({
//       data: shops,
//     });

//     logger.info(
//       `shops were fetched  - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - from ${req.ip}`
//     );
//   } catch (error) {
//     console.log(error);
//     throw Object.assign(new Error(`${error}`), {
//       statusCode: error.statusCode,
//     });
//   }
// });

//desc get all barbers end point
//access public
//routes /babers
const getbabers = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  try {
    owner = false;
    const totalCount = await COFFEE.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    const shops = await COFFEE.find({ category: "barbers" })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.status(200).json({
      owner: owner,
      data: shops,
      page: page,
      totalPages: totalPages,
    });

    logger.info(
      `shops were fetched  - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - from ${req.ip}`
    );
  } catch (error) {
    console.log(error);
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

/**
 * @api {get} /getallone Get All Shops for One User
 * @apiName GetAllShopsOne
 * @apiGroup Shop
 *
 * @apiHeader {String} Authorization User's authorization token.
 * @apiParam {Number} [page=1] Page number.
 * @apiParam {Number} [pageSize=10] Number of shops per page.
 *
 * @apiSuccess {Array} data Array of shop objects owned by the user.
 * @apiSuccess {Number} page Current page number.
 * @apiSuccess {Number} totalPages Total number of pages.
 * @apiSuccess {String} token Authorization token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "_id": "shopId",
 *           "name": "shopName",
 *           // other shop fields
 *         },
 *         // more shop objects
 *       ],
 *       "page": 1,
 *       "totalPages": 10,
 *       "token": "authorizationToken"
 *     }
 *
 * @apiError (401) NotAuthorized The user is not authorized to access this data.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "NotAuthorized"
 *     }
 */

const getallshopone = asynchandler(async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const { id } = req.auth;

  if (!id)
    throw Object.assign(new Error("Not authorized"), { statusCode: 401 });

  try {
    const totalCount = await COFFEE.countDocuments({ owner: id });
    const totalPages = Math.ceil(totalCount / pageSize);
    const shops = await COFFEE.find({ owner: id })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const shopsWithWorkingHours = [];
    for (const shop of shops) {
      const shopData = shop.toObject();
      const whours = await working_hours.findOne({ shopId: shop._id });

      // Optionally, you can add the working hours to the shop data
      shopData.whours = whours;
      shopsWithWorkingHours.push(shopData);
    }

    const token = generateToken(id);
    res.status(200).header("Authorization", `Bearer ${token}`).json({
      shopsWithWorkingHours,
      page: page,
      totalPages: totalPages,
    });

    logger.info(
      `user with id ${id}, fetched all his products - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - from ${req.ip} `
    );
  } catch (error) {
    console.log(error);
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

 * @api {put} /updateS/:shopId Update Shop
 * @apiName UpdateShop
 * @apiGroup Shop
 *
 * @apiHeader {String} Authorization User's authorization token.
 * @apiParam {String} shopId ID of the shop to update.
 * @apiParam {Object} updateData Data to update.
 *
 * @apiSuccess {Boolean} successful Indicates whether the update was successful.
 * @apiSuccess {Object} data Updated shop object.
 * @apiSuccess {Object} workingHours Working hours of the shop.
 * @apiSuccess {String} token Authorization token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 202 Accepted
 *     {
 *       "successful": true,
 *       "data": {
 *         "_id": "shopId",
 *         "name": "shopName",
 *         // other updated shop fields
 *       },
 *       "workingHours": {
 *         "monday": {
 *           "opening": "09:00",
 *           "closing": "17:00"
 *         },
 *         // other days
 *       },
 *       "token": "authorizationToken"
 *     }
 *
 * @apiError (400) ShopIdEmpty Shop ID is empty.
 * @apiError (400) UpdateDataEmpty Update data is empty.
 * @apiError (401) NotAuthorized The user is not authorized to update this data.
 * @apiError (404) ShopNotFound The shop was not found.
 * @apiError (404) ErrorUpdatingShop An error occurred while updating the shop.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "ShopIdEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "UpdateDataEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "NotAuthorized"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ShopNotFound"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ErrorUpdatingShop"
 *     }
 */

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

 * @api {put} /updateH/:shopId Update Shop Working Hours
 * @apiName UpdateShopWorkingHours
 * @apiGroup Shop
 *
 * @apiHeader {String} Authorization User's authorization token.
 * @apiParam {String} shopId ID of the shop to update.
 * @apiParam {String} monday_opening_hours Opening hours on Monday.
 * @apiParam {String} monday_closing_hours Closing hours on Monday.
 * @apiParam {String} tuesday_opening_hours Opening hours on Tuesday.
 * @apiParam {String} tuesday_closing_hours Closing hours on Tuesday.
 * @apiParam {String} wednesday_opening_hours Opening hours on Wednesday.
 * @apiParam {String} wednesday_closing_hours Closing hours on Wednesday.
 * @apiParam {String} thursday_opening_hours Opening hours on Thursday.
 * @apiParam {String} thursday_closing_hours Closing hours on Thursday.
 * @apiParam {String} friday_opening_hours Opening hours on Friday.
 * @apiParam {String} friday_closing_hours Closing hours on Friday.
 * @apiParam {String} saturday_opening_hours Opening hours on Saturday.
 * @apiParam {String} saturday_closing_hours Closing hours on Saturday.
 * @apiParam {String} sunday_opening_hours Opening hours on Sunday.
 * @apiParam {String} sunday_closing_hours Closing hours on Sunday.
 *
 * @apiSuccess {Boolean} successful Indicates whether the update was successful.
 * @apiSuccess {Object} data Updated working hours object.
 * @apiSuccess {String} token Authorization token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 202 Accepted
 *     {
 *       "successful": true,
 *       "data": {
 *         "shopId": "shopId",
 *         "hours": {
 *           "monday": {
 *             "opening": "09:00",
 *             "closing": "17:00"
 *           },
 *           // other days
 *         },
 *       },
 *       "token": "authorizationToken"
 *     }
 *
 * @apiError (400) WorkingHoursIdEmpty Working hours ID is empty.
 * @apiError (400) RequiredFieldsEmpty Required fields cannot be empty.
 * @apiError (401) NotAuthorized The user is not authorized to update this data.
 * @apiError (404) WorkingHoursNotFound The working hours were not found.
 * @apiError (500) ErrorUpdatingHours An error occurred while updating the working hours.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "WorkingHoursIdEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "RequiredFieldsEmpty"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "NotAuthorized"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "WorkingHoursNotFound"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "ErrorUpdatingHours"
 *     }
 */



const deleteShop = asynchandler(async (req, res) => {
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
