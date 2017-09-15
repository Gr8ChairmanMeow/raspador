/* Scrape and Display
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var path = require("path")
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("./public"));

//use handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//end handlebars

// Database configuration with mongoose
//mongodb://localhost/raspador
//mongodb://heroku_kmxpkwng:oemn7avn4doc1ka393q4clevtj@ds135234.mlab.com:35234/heroku_kmxpkwng
mongoose.connect("mongodb://heroku_kmxpkwng:oemn7avn4doc1ka393q4clevtj@ds135234.mlab.com:35234/heroku_kmxpkwng");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});


// Routes
// ======
app.get("/", function(req, res) {
    Article.find({}).populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                var hbsObject = {
                    articles: doc
                };
                console.log(hbsObject);
                res.render("index", hbsObject);
            }
        });
});

app.get("/saved", function(req, res) {
    Article.find({}).populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                var hbsObject = {
                    articles: doc
                };
                console.log(hbsObject);
                res.render("saved", hbsObject);
            }
        });
});


// Redirect to comments page
app.get("/comments/:id", function(req, res) {
    if (req.params.id === "app.js") { res.send() }
    Article.findById(req.params.id)
        // ..and string a call to populate the entry with the books stored in the library's books array
        // This simple query is incredibly powerful. Remember this one!
        .populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
                console.log(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                // console.log("////////////////",doc.notes,"//////////////////")
                var hbsObject = {
                    article: doc.title,
                    notes: doc.notes
                };
                // console.log("++++++++++++",hbsObject,"++++++++++++++++");
                res.render("comments", hbsObject);
            }
        });
});
// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
    /* //clear collection if exists
     Article.remove({}, function(err) {
         console.log('collection removed')
     });*/
    // First, we grab the body of the html with request
    request("http://www.pewsocialtrends.org/", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $("div.posts.masonry a.post").each(function(i, element) {
            console.log($(this));
            // Save an empty result object
            var result = {};

            //help var
            var post = $(this);
            //end var

            // Add the text and href of every link, and save them as properties of the result object
            result.title = post.attr('data-title');
            result.link = post.attr("href");

            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            Article.find({ title: result.title }, function(err, data) {
                if (data.length === 0) {
                    entry.save(function(err, data) {
                        if (err) throw err;
                    });
                }
            });

        });
        res.send("Scrape Complete");
    });
    // Tell the browser that we finished scraping the text
    //res.send("Scrape Complete");
    //res.redirect("/");

});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    Article.find({}).populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                res.send(doc);
            }
        });

});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
    // TODO
    // ====

    // Finish the route so it finds one article using the req.params.id,

    // and run the populate method with "note",

    // then responds with the article with the note included

    Article.findById(req.params.id)
        // ..and string a call to populate the entry with the books stored in the library's books array
        // This simple query is incredibly powerful. Remember this one!
        .populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
                console.log(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                res.send(doc);
            }
        });

});

//save
app.get("/save/:id", function(req, res) {

    // Find our user and push the new note id into the User's notes array
    Article.findOneAndUpdate({ _id: req.params.id }, { $set: { "saved": true } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
            res.send(err);
        }
        // Or send the newdoc to the browser
        else {
            console.log(newdoc)
            res.send(newdoc);
        }
    });

});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {


    // TODO
    // ====

    // save the new note that gets posted to the Notes collection

    // then find an article from the req.params.id

    // and update it's "note" property with the _id of the new note
    var newNote = new Note(req.body);
    // Save the new note to mongoose
    newNote.save(function(error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Otherwise
        else {
            // Find our user and push the new note id into the User's notes array
            Article.findOneAndUpdate({ _id: req.params.id }, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
                // Send any errors to the browser
                if (err) {
                    res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                    console.log(newdoc)
                    res.send(newdoc);
                }
            });
        }
    });


});

// This will grab an article by it's ObjectId
app.get("/notes/:id", function(req, res) {
    // TODO
    // ====

    // Finish the route so it finds one article using the req.params.id,

    // and run the populate method with "note",

    // then responds with the article with the note included

    Note.findById(req.params.id, function(error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
            console.log(error);
        }
        // Or, send our results to the browser, which will now include the books stored in the library
        else {
            res.send(doc);
        }
    });

});

// Create a new note or replace an existing note
app.post("/notes/:id", function(req, res) {

    var update = req.body;
    Note.findOneAndUpdate({ _id: req.params.id }, { $set: { "title": update.title, "body": update.body } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
            res.send(err);
        }
        // Or send the newdoc to the browser
        else {
            console.log(newdoc)
            res.send(newdoc);
        }
    });


});

app.get("/delete/notes/:id", function(req, res) {
    Note.findByIdAndRemove(req.params.id, function(error, note) {
        if (error) {
            res.send(error);
        } else {
            res.redirect("/");
        };
    });
    /*  Article.findById(req.params.id).populate("notes")
          // Now, execute that query
          .exec(function(error, doc) {
              // Send any errors to the browser
              if (error) {
                  res.send(error);
              }
              // Or, send our results to the browser, which will now include the books stored in the library
              else {
                  var hbsObject = {
                      articles: doc
                  };
                  console.log(hbsObject);
                  res.render("index", hbsObject);
              }
          });*/
});


// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port 3000!");
});