module.exports = function (err, req, res, next) {
  let statusCode = 500;
  let errorCode = "UNKNOWN_ERROR";
  let message = "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    let msg = [];
    err.errors.forEach((error) => {
      msg.push(error.message);
    });
    message = msg;
  } else if (err.name == "DATA_NOT_FOUND") {
    statusCode = 404;
    errorCode = `Data_NOT_FOUND`;
    message = `Data Doesn't Exist`;
  } else if (err.name == "INVALID_EMAIL") {
    statusCode = 400;
    errorCode = `INVALID_EMAIL`;
    message = `Wrong Email`;
  } else if (err.name == "INVALID_PASSWORD") {
    statusCode = 400;
    errorCode = `INVALID_PASSWORD`;
    message = `Wrong Password`;
  } else if (err.name == "EMAIL_ALREADY_EXIST") {
    statusCode = 400;
    errorCode = "EMAIL_ALREADY_EXIST";
    message = `Email Already Exist`;
  } else if (err.name == "LOGIN_FIRST") {
    statusCode = 400;
    errorCode = "LOGIN_FIRST";
    message = `Please Login First!`;
  }

  res.status(statusCode).json({ errorCode, message });
};
