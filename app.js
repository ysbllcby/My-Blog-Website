//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

// Post Schema
const postSchema = {
  title: String,
  content: String,
};

// Post Model
const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est.";
const aboutContent = "Hac habitasse platea dictumst.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
  // res.render("home", {startingContent: homeStartingContent});
  Post.find()

    .then(function (posts) {
      posts.forEach(function (post) {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts,
        });
      });
    })

    .catch(function (err) {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }).then(function (post) {
    console.log(post); // check if post object is defined
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
