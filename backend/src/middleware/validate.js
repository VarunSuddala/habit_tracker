/**
 * Simple request body validation middleware factory.
 * Takes an array of required field names and returns middleware
 * that checks they exist in req.body.
 */
const validate = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { validate };
