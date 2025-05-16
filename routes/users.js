const express = require("express");
const {
  getUsers,
  getUserById,
  upUser,
  delUser,
} = require("../controllers/users.controllers");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
router.use(express.json());

router.get("/", authenticateToken, getUsers);

router.get("/:id", authenticateToken, getUserById);

router.put("/:id", authenticateToken, upUser);

router.delete("/:id", authenticateToken, delUser);

module.exports = router;
