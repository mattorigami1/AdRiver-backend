const makeResponse = (res, statusCode, message, data, error) => {
  if (error) {
    return res
      .status(statusCode)
      .json({ statusCode, message, error, data: null });
  } else {
    return res.status(statusCode).json({ statusCode, message, error, data });
  }
};

module.exports = makeResponse;
