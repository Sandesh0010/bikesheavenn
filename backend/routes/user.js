const express = require("express");
const router = express.Router();
const {
  userSignUp,
  userLogin,
  getUser,
  adminLogin,
  getAllUsers,
  deleteUser,
} = require("../controller/userController");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/adminAuth");

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.post("/admin-login", adminLogin);
router.get("/user/:id", getUser);

// Admin RBAC Routes
router.get("/all", isAdmin, getAllUsers);
router.delete("/:id", isAdmin, deleteUser);

module.exports = router;
