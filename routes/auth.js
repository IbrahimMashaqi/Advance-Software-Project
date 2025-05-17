const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
} = require("../controllers/auth.controller");

router.use(express.json());

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

module.exports = router;
