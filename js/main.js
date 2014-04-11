$(function() {
  var pageName = window.location.href.toString().split(window.location.host)[1];
  switch(pageName) {
    case "/about.html":
      $("#about").attr("class", "active");
      break;
    case "/help.html":
      $("#help").attr("class", "active");
      break;
    case "/contact.html":
      $("#contact").attr("class", "active");
      break;
  }
});
