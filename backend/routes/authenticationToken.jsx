const jwt = require("jsonwebtoken");

const authenticateToken = (secretKey) => (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const token = authHeader.substring(7); // Remove "Bearer " from the token
  req.token = token; // Store the token in the request object

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      return res.status(401).json({ error: "Token has expired." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error verifying the token.",
    });
  }
};

module.exports = authenticateToken;
