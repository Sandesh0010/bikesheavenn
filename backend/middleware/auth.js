const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  console.log("Authorization header:", token);

  if (token) {
    token = token.split(" ")[1];
    console.log("Extracted token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        return res
          .status(401)
          .json({ message: "Invalid token", error: err.message });
      } else {
        console.log("JWT decoded successfully:", decoded);
        req.user = decoded;
        next();
      }
    });
  } else {
    console.log("No authorization header found");
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = verifyToken;
