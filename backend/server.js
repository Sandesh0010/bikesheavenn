const express = require("express");
const dotenv = require("dotenv").config();
const crypto = require("crypto");

// Use a random secret on every restart in development to clear sessions
if (process.env.NODE_ENV !== "production" || !process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString("hex");
  console.log(
    "Volatile JWT_SECRET generated for this session. All users will be logged out on server restart.",
  );
}
const connectDB = require("./config/db.js");
const cors = require("cors");

const app = express();

// connect to Mongo
connectDB();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5173", // local dev
    "https://bikesheavennfrontend.vercel.app/", // vercel
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static("public"));

//endpoints
app.get("/", (req, res) => {
  res.json({ message: "BikesHeaven Backend is running!" });
});

app.use("/api/bikes", require("./routes/bikes"));
app.use("/api/user", require("./routes/user"));

// For local
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app;
