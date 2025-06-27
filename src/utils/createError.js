function createError(code, message) {
  const errorMessage = message || "Something went wrong";
  const statusCode = code || 500;

  const err = new Error(errorMessage);
  err.statusCode = statusCode;
  return err;
}

module.exports = createError;
