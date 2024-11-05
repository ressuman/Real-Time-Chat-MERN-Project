const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Check if authorization header is provided
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "Authorization header missing",
        success: false,
      });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Token not provided",
        success: false,
      });
    }

    // Verify the token and extract payload
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // {userId: user._id}
    req.body.userId = decodedToken.userId; // Attach user ID to the request body

    next();
  } catch (error) {
    res.status(401).send({
      message: "Authentication failed: " + error.message,
      success: false,
    });
  }
};
