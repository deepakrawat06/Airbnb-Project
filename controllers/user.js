const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = await new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) {
        next(err);
      }
      req.flash("success", "New User login");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  } catch (error) {
    req.flash("fail", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/signin.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust! You are logged in ! ");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "User is logged Out.!");
  res.redirect("/listings");
};
