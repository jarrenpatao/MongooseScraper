const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArticles";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/scrape", (req, res) => {
  axios.get("https://medium.com/topic/technology").then((response) => {

    var $ = cheerio.load(response.data);

    $("div.cb-meta").each((i, element) => {

      var result = {};

      result.title = $(this)
        .find("a")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");
      result.summary = $(this)
        .find("div.cb-excerpt")
        .text();
      result.imgLink = $(this)
        .parent()
        .find("div.cb-mask")
        .find("img")
        .attr("src")
      console.log(result)
      db.Article.remove({}).then(() => {     
      db.Article.create(result)
        .then((dbArticle) => {
          console.log(dbArticle);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })

    res.send("Scrape Complete");
  });
});

app.get("/articles", (req, res) => {
  db.Article.find({})
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((err) => {
      res.json(err);
    });
});
app.get("/articles/:id", (req, res) => {
  db.Article.findById(req.params.id)
  .populate("note")
  .then((dbArticle) => {
    res.json(dbArticle);
  })
  .catch((err) => {
    res.json(err);
  });
});

app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
  .then((dbNote) => {
    return db.Article.findByIdAndUpdate(req.params.id, { note: dbNote._id }, { new: true });
  })
  .then((dbNote) => {
    res.json(dbNote);
  })
  .catch((err) => {
    res.json(err);
  });
});

app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});