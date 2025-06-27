const errorHandler = (err, req, res, next) => {
  console.log("Error: ", err);
  const statusCode = err.statusCode || 500;

  res
    .status(statusCode)
    .json({ message: err.message || "Something went wrong" });
};

module.exports = errorHandler;
