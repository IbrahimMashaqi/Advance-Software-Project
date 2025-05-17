const express = require("express");
const router = express.Router();
const { deleteReview } = require("../database_managment/reviews_db.js");
router.use(express.json());
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

router.delete("/:reviewId", authenticateToken, async (req, res) => {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const reviewId = req.params.reviewId;
    const data = await deleteReview(reviewId, token);
    if (data) {
      res.status(201).json({ message: data.message, data: data.id });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
