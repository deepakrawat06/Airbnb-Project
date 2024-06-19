if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const session = require("express-session");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const flash = require("connect-flash");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const passport = require("passport");



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080, () => {
  console.log("server is listening at port ");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());

app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(passport.initialize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.fail = req.flash("fail");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRoute);
app.use('/listings/:id/reviews', reviewRoute);
app.use("/", userRoute);




app.all("*", (req, res, next) => {
  next(new ExpressError(404, "404: Page Not Found"));
  
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something broke!" } = err;
  res.status(status).render("listings/error.ejs", { err });
});

