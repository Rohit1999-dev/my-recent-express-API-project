const errorHandler = (err, req, res, next) => {
  console.error(err, `errorHandler -- 2`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;