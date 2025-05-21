const express = require("express");
const {
  getOrphanages, getOrphanageById,
  addOrphanage, upOrphanage,
  delOrphanage, getOrphansFromOrphanage, assignOrphan, 
  unassignOrphan, getVolunteersFromOrphanage,
} = require("../controllers/orphanages.controller");
const { getReviewsForOrphanage } = require("../controllers/reviews.controller");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
router.use(express.json());

router.get("/", authenticateToken, getOrphanages);
router.get("/:id", authenticateToken, getOrphanageById);
router.post("/", authenticateToken, addOrphanage);
router.put("/:id", authenticateToken, upOrphanage);
router.delete("/:id", authenticateToken, delOrphanage);
router.get('/:id/orphans', authenticateToken, getOrphansFromOrphanage);
router.post('/:orphanageId/assign/:orphanId', authenticateToken, assignOrphan);
router.delete('/unassign/:id', authenticateToken, unassignOrphan); 
router.get('/:id/volunteers', authenticateToken, getVolunteersFromOrphanage);
router.get('/:id/reviews', authenticateToken, getReviewsForOrphanage);

module.exports = router;