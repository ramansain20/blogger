require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//=================================================DATABASES===================================================//

mongoose.connect("mongodb://localhost:27017/blogger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: String,
  timeStamp: String,
});

const Post = mongoose.model("Post", postSchema);
//============================================DATABASES========================================================//

//============================================APP ROUTES=======================================================//

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});
//---------------------------------------LOG IN ROUTE---------------------------------------------------------//
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("logged in");
});

//---------------------------------------LOG IN ROUTE---------------------------------------------------------//
//---------------------------------------SIGN UP ROUTE---------------------------------------------------------//
app.post("/signup", (req, res) => {
  User.register({ username: req.body.user }, req.body.password, (err, user) => {
    if (err) {
      return res.send("error occurred");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.send("registered");
      });
    }
  });
});
//---------------------------------------SIGN UP ROUTE---------------------------------------------------------//
app.post("/create", (req, res) => {});

//=====================================APP ROUTES==============================================================//
app.listen(3000, () => {
  console.log("server started");
});
