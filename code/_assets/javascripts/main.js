//= require_directory ./vendor

//From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var installURL = "http://www.streamkeys.com/guide.html?installed=true";

//Lightbox setup
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox();
}); 

//Install button states
var InstallState = (function() {

  var installed = false,
      button = "#download-button",
      unsupported = $("#unsupported-browser"),
      error_message = ".install-error";

  var setButtons = function(text) {
    $(button).html(text);
  };

  var setButtonsAttribute = function(key, val, type) {
    if(type === "attr") $(button).attr(key, val);
    if(type === "css")  $(button).css(key, val);
  };

  var disableButtons = function() {
    $(button).attr("disabled", "disabled");
  };

  return {
    setDefault: function() {
      setButtons("<i class=\"fa fa-download\"></i>&nbsp;&nbsp;Download for Chrome");
    },
    setInstalled: function(fromExtension) {
      installed = true;
      disableButtons();
      setButtons("<i class=\"fa fa-check\"></i>&nbsp;&nbsp;Installed!");
    },
    setInstalling: function() {
      console.log("Set Installing..." + installed);
      setButtons("<i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp;&nbsp;Installing...");
    },
    setError: function() {
      disableButtons();
      $(button).removeClass("btn-install-homepage")
            .html("<i class=\"fa fa-exclamation\"></i>&nbsp;&nbsp;Install failed. Refresh page.");
      $(error_message).toggle();
    },
    setCustom: function(msg) {
      setButtons(msg);
    },
    setUnsupported: function() {
      setButtonsAttribute("disabled", "disabled", "attr");
      setButtonsAttribute("display", "inline", "css");
      this.setCustom("Google Chrome Required!");
    }
  }
})();

//Install the extension
var onClickInstall = function() {
  sessionStorage.setItem("streamkeys-install", "site");
  InstallState.setInstalling();
  chrome.webstore.install(undefined,
    function() {
      console.log("Streamkeys installed!");
      InstallState.setInstalled();
    },
    function(msg) {
      console.log("Streamkeys installed failed. Error: ", msg);
      InstallState.setError();
    }
  );
};

//Check if the extension is installed
var checkInstalled = function() {
  if(sessionStorage.getItem("sk-installed")) {
    InstallState.setInstalled(true);
  } else {
    if(!(window.chrome != null && window.navigator.vendor === "Google Inc.")) InstallState.setUnsupported();
    else InstallState.setDefault();
  }
};

//Message from extension means that it is installed, set the cookie
document.addEventListener("streamkeys-installed", function(e) {
  console.log("Installed.");
  InstallState.setInstalled(true);
  sessionStorage.setItem("sk-installed", true);
})

//Parse query string and toggle any hidden divs
var toggleDivs = function() {
  var pageName = window.location.href.toString().split(window.location.host)[1].split('?')[0];
  if(getParameterByName("installed")) {
    $("#version-container").toggle();
    $("#installed").toggle();
  }
  if(getParameterByName("updated")) {
    $("#version-container").toggle();
    $("#updated").toggle();
  }
}

//Post requested site to contact backend
var postMessage = function(message) {
  $.ajax({
    type: "POST",
    url: "http://contact.streamkeys.com/contact",
    crossDomain: true,
    data: message
  })
    .always(function(jqXHR, textStatus) {
      console.log( "textStatus: ", textStatus );
      console.log( "response: ", jqXHR);
      $("#request-container").hide();
      $("#request-success").show();
    });
};

$("[data-toggle=clear]").click(function(e) {
  e.target.value = "";
});

$(function() {

  toggleDivs();

  //Install button click handler
  $("#download-button").click(function() {
    onClickInstall();
  });

  $("#site-submit-button").click(function() {
    event.preventDefault();

    var data = {
      url: $("#site_url").val(),
      email: $("#email").val(),
      message: $("#comments").val(),
      timestamp: $("#timestamp").val()
    };
    if(data.url === "") {
      $("#site_url").addClass("input-error");
      $("#site_url").attr("placeholder", "Please enter a URL");
    } else {
      postMessage(data);
    }
  });

  if($("#timestamp")) $("#timestamp").val(Date.now());

  checkInstalled();
});

