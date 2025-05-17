const express = require("express");
const { getReviews, addReview, delReview } = require("../controllers/reviews.controller");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
router.use(express.json());

router.get("/", authenticateToken, getReviews);
router.post("/addReview", authenticateToken, addReview);
router.delete("/:id", authenticateToken, delReview);


module.exports = router;