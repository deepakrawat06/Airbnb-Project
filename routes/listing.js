const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn } = require("../middlewares/loggedin.js");
const { validateListing } = require("../middlewares/validate.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(asyncWrap(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, asyncWrap(listingController.create));

//New Route
router.get("/new", isLoggedIn, listingController.new);

// router.get('/', listingController.search);

router
  .route("/:id")
  .get(asyncWrap(listingController.show))
  .put(isLoggedIn, upload.single("listing[image]"), validateListing, asyncWrap(listingController.update))
  .delete(isLoggedIn, asyncWrap(listingController.delete));

//Edit Route
router.get("/:id/edit", isLoggedIn, asyncWrap(listingController.edit));

module.exports = router;
