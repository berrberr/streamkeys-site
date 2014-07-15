//From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

document.addEventListener("streamkeys-installed", function(e) {
  InstallState.setInstalled();
})

var InstallState = (function() {

  var installed = false,
      buttons = $(".btn-install-cta"),
      unsupported = $("#unsupported-browser");

  var setButtons = function(text) {
    buttons.each(function (index, el) {
      el.innerHTML = text;
    });
  };

  return {
    initInstallCheck: function() {
      installCheck.apply({count: 0});
    },
    setDefault: function() {
      setButtons("<i class=\"fa fa-download\"></i>&nbsp;&nbsp;Download for Chrome");
    },
    setInstalled: function() {
      installed = true;
      setButtons("<i class=\"fa fa-check\"></i>&nbsp;&nbsp;Installed!");
    },
    setInstalling: function() {
      console.log("set installin" + installed);
      setButtons("<i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp;&nbsp;Installing...");
    },
    setCustom: function(msg) {
      setButtons(msg);
    },
    setUnsupported: function() {
      buttons.each(function(index, el) {
        el.hide();
      });
      unsupported.show();
    }
  }
})();

var onClickInstall = function() {
  InstallState.setInstalling();
  chrome.webstore.install(undefined,
    function() {
      console.log("Streamkeys installed!");
      InstallState.setInstalled();
    },
    function(msg) {
      console.log("Streamkeys installed failed. Error: ", msg);
      InstallState.setCustom("<i class=\"fa fa-exclamation\"></i>&nbsp;&nbsp;Install failed. Refresh to try again.");
    }
  );
}

$(".btn-install-cta").click(function(e) {
  onClickInstall();
});

$(function() {
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
