exports.send = function (res, statusCode, message, data) {
    return res.status(statusCode).json({
      error: false,
      message: message,
      data: data,
    });
  };