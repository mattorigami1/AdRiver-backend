const makeResponse = (res, statusCode, message, data, error) => {
  if (error) {
    return res.status(statusCode).json({ statusCode, message, err: data });
  } else {
    return res.status(statusCode).json({ statusCode, message, data });
  }
};

module.exports = makeResponse;
