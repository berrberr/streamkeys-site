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
      buttons = $(".btn-install-cta"),
      unsupported = $("#unsupported-browser");

  var setButtons = function(text) {
    buttons.each(function (index, el) {
      el.innerHTML = text;
    });
  };

  var setButtonsAttribute = function(key, val, type) {
    buttons.each(function (index, el) {
      if(type === "attr") $(el).attr(key, val);
      if(type === "css")  $(el).css(key, val);
    });
  };

  var disableButtons = function() {
    buttons.each(function (index, el) {
      $(el).attr("disabled", "disabled");
    });
  };

  return {
    setDefault: function() {
      setButtons("<i class=\"fa fa-download\"></i>&nbsp;&nbsp;Download for Chrome");
      $("#btn-install-header").show();
    },
    setInstalled: function(fromExtension) {
      installed = true;
      disableButtons();
      if(fromExtension) $("#btn-install-header").hide();
      setButtons("<i class=\"fa fa-check\"></i>&nbsp;&nbsp;Installed!");
    },
    setInstalling: function() {
      console.log("Set Installing..." + installed);
      setButtons("<i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp;&nbsp;Installing...");
    },
    setError: function() {
      disableButtons();
      $(".btn-install-cta").each(function (index, el) {
        $(el)
          .removeClass("btn-install-homepage")
          .html("<i class=\"fa fa-exclamation\"></i>&nbsp;&nbsp;Install failed. Refresh to try again.");
      })
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

//Install button click handler
$(document).on("click", ".btn-install-cta", function(e) {
  onClickInstall();
});

//Parse query string and toggle any hidden divs
var toggleDivs = function() {
  var pageName = window.location.href.toString().split(window.location.host)[1].split('?')[0];
  if(getParameterByName("installed")) $("#installed").toggle();
  if(getParameterByName("updated")) $("#updated").toggle();
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
      $("#request-form").hide();
      $("#request-success").show();
    });
};

$("#requestModal").on("show.bs.modal", function(e) {
  //Cleanup previous states
  $("#request-form").show();
  $("#request-success").hide();
  $("#site_url_container").removeClass("has-error");

  url: $("#site_url").val("");
  email: $("#email").val("");
  message: $("#comments").val("");
});

$("[data-toggle=clear]").click(function(e) {
  e.target.value = "";
});

$(function() {

  toggleDivs();

  $("#contact_button").click(function() {
    event.preventDefault();

    var data = {
      url: $("#site_url").val(),
      email: $("#email").val(),
      message: $("#comments").val(),
      timestamp: $("#timestamp").val()
    };
    if(data.url === "") {
      $("#site_url_container").addClass("has-error");
      $("#site_url").val("Please enter a URL");
    } else {
      postMessage(data);
    }
  });

  if($("#timestamp")) $("#timestamp").val(Date.now());
});

checkInstalled();
