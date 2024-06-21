const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/loggedin");
const userController = require("../controllers/user");


//signup 
router.route("/signup").get(userController.renderSignupForm).post(saveRedirectUrl, asyncWrap(userController.signup));

//login form

router
  .route("/login")
  .get(asyncWrap(userController.renderLoginForm))
  .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);


router.get("/logout", userController.logout);

module.exports = router;
