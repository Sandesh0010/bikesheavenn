const express = require("express");
const {
  getBikes,
  getMyBikes,
  getBike,
  addBike,
  editBike,
  deleteBike,
  upload,
} = require("../controller/bikesController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/", getBikes); // Get all bikes

router.get("/mybikes", verifyToken, getMyBikes); // Get user's bikes

router.get("/:id", getBike); // Get bike by ID

router.post("/", verifyToken, upload.single("file"), addBike); // Add a new bike

router.put("/:id", upload.single("file"), editBike); // Edit bike

router.delete("/:id", deleteBike); // Delete bike

module.exports = router;
