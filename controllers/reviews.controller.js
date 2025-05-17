const {
  getAllReviews,
  getReviewsById,
  addReviewReq,
  deleteReview
} = require("../database_managment/reviews_db");

async function getReviews(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const result = await getAllReviews(token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getReviewsForOrphanage(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const result = await getReviewsById(id,token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}




async function addReview(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const {orphanageId, donorId, rating, comment, reviewDate} = req.body
    const result = await addReviewReq(orphanageId, donorId, rating, comment, reviewDate,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


async function delReview(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await deleteReview(id, token);
    res.status(result.statusCode).send(result.message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}


module.exports = { getReviews, getReviewsForOrphanage, addReview, delReview };