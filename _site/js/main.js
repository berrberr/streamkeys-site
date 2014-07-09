//From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};


$(function() {

  $(".btn-install").click(function(e) {
    console.log("installing...");
    chrome.webstore.install(undefined,
      function() {
        console.log('success');
      },
      function(msg) {
        console.log('failed, ' + msg);
      }
    );
  });

  $("#showguide").click(function() {
    event.preventDefault();
    $("#pictureguide").toggle();
  });

  $("#contact_button").click(function() {
    event.preventDefault();
    var data = {
      url: $("#site_url").val(),
      message: $("#comments").val()
    };
    postMessage(data);
  });

  var postMessage = function(message) {
    $.ajax({
      type: "POST",
      url: "http://contact.streamkeys.com",
      data: message
    })
      .always(function(jqXHR, textStatus) {
        console.log( "textStatus: ", textStatus );
        console.log( "response: ", jqXHR);
        window.location.href = "sites.html?sentmessage=true";
      });
  };

});
