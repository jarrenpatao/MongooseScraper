$.getJSON("/articles", function(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<b>" + data[i].title + "</b>" +
     "<br />" + data[i].summary + "<br />" +
      data[i].link + "<img src =" + data[i].imgLink + ">" + "</p>");
  }
});

$(document).on("click", "p", function() {

  $("#notes").empty();
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then((data) => {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", () => {

  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then((data) => {
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});