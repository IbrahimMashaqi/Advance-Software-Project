const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/opportunity.controller.js");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticateToken, create);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

module.exports = router;
