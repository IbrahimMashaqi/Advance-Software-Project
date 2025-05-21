const express = require("express");
const {
  getOrphans,
  getOrphanById,
  addOrphan,
  upOrphan,
  delOrphan,
} = require("../controllers/orphans.controller");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
router.use(express.json());

router.get("/", authenticateToken, getOrphans);
router.get("/:id", authenticateToken, getOrphanById);
router.post("/", authenticateToken, addOrphan);
router.put("/:id", authenticateToken, upOrphan);
router.delete("/:id", authenticateToken, delOrphan);

module.exports = router;
