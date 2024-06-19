const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");
const { createReview, deleteReview } = require('../controllers/review');
const { validateReview } = require('../middlewares/validate');
const {isLoggedIn} = require('../middlewares/loggedin');


//Post route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(createReview)
);

//Delete Route
router.delete('/:reviewId',isLoggedIn,
asyncWrap(deleteReview));

module.exports = router;