// Grab the articles as a json
/*$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});*/

$(document).on("click", ".btn-edit", function() {
  console.log($(this).attr("data-id"))
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Redirect to comments page

  // window.location.href = "/comments"; //REDIRECT

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      // // The title of the article
      $("#notes").append("<h5>Note ID: <h6>" + data._id + "</h6></h5>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='updatenote'>Update Note</button>");

      // If there's a note in the article
      if (data.title) {
        console.log("Success!")
        // Place the title of the note in the title input
        $("#titleinput").val(data.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.body);
      }
      else{
        console.log("Errorrr!")
      }
    });
});

// Whenever someone clicks a p tag
$(document).on("click", ".btn-add", function() {
  console.log("Test")
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Redirect to comments page

  // window.location.href = "/comments"; //REDIRECT

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      //console.log(data.notes);
      // The title of the article
      $("#notes").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

/*      // If there's a note in the article
      if (data.notes) {
        console.log("Success!")
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
      else{
        console.log("Errorrr!")
      }*/
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#updatenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  window.location.reload();
});

$(document).on("click", ".btn-comments", function() {
  //console.log("BUTTON!",$(this).attr("data-id")) 
  //console.log($(this).parent().text().split(" Save",1)[0].trim());
  window.location.href = "/comments/" + $(this).attr("data-id");
});

$(document).on("click", ".btn-info", function() {
  $.ajax({
    method: "GET",
    url: "/clearAll"
  })
    // With that done, add the note information to the page
    .done(function(data) {

      console.log(data);
      window.location.reload();

    });
});

/*$(document).on("click", ".btn-save", function() {
  console.log("SAVE BUTTON!",$(this).attr("data-id"));
});*/

$(document).on("click", ".btn-delete", function() {
  $.ajax({
    method: "GET",
    url: "/delete/notes/" + $(this).attr("data-id")
  })
    // With that done, add the note information to the page
    .done(function(data) {

      console.log(data);
      window.location.reload();

    });
});

$(document).on("click", ".btn-danger", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .done(function(data) {

      console.log(data);
      window.location.href = "/"

    });
});

$(document).on("click", ".btn-success", function() {
  window.location.href = "/saved";
});

$(document).on("click", ".btn-save", function() {
  $.ajax({
    method: "GET",
    url: "/save/" + $(this).attr("data-id")
  })
    // With that done, add the note information to the page
    .done(function(data) {

      console.log(data);

    });
});