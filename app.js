//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Request targeting all articles//

app.route("/articles")

.get(function(req, res){
    Article.find({})
    .then(function (foundItems) {
        res.send(foundItems);
    })
    .catch((err) => {
        console.log("err");
    });
})

.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany({})
    .then(function () {
        console.log("Successfully deleted items");
    })
    .catch((err) => {
        console.log("err");
    });
});

// Request targeting a specific article//

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}).then(function (foundItem) {
        if (foundItem === null) {
            res.send("No articles matching that title was found.");
        } else {
            res.send(foundItem);
        }
    })
    .catch((err) => {
        console.log(err);
    });
})

.put(function(req, res){

    Article.findOneAndUpdate(
        {title: req.params.articleTitle},  
        {title: req.body.title, content: req.body.content}
    )
    .then(function(){
        res.send("Successfully updated article.")
    })
    .catch((err) => {
        console.log(err);
    });
})

.patch(function(req, res){
    
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},  
        {$set: req.body}
    )
    .then(function(){
        res.send("Successfully updated article.")
    })
    .catch((err) => {
        console.log(err);
    });
})

.delete(function(req, res){
    
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(function(){
        res.send("Successfully deleted article.")
    })
    .catch((err) => {
        console.log(err);
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});