const { stack } = require("../routes/user");

const errorHandler = (err, req, res, next) => {
  let statusCode;
  if (err.statusCode || res.statusCode) {
    statusCode = err.statusCode ? err.statusCode : res.statusCode;
  } else {
    statusCode = 500;
  }
  const errorMessage = err.message
    ? err.message.startsWith("Error: ")
      ? err.message.slice(7)
      : err.message
    : process.env.NODE_ENV === "Production"
    ? "Server Error"
    : "Something went wrong";

  res.status(statusCode).json({
    Message: errorMessage,
  });
  next();
};
module.exports = {
  errorHandler,
};
