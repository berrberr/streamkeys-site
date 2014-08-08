//From: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

//Lightbox setup
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
}); 

//Message from extension
document.addEventListener("streamkeys-installed", function(e) {
  InstallState.setInstalled(false);
})

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

  return {
    setDefault: function() {
      setButtons("<i class=\"fa fa-download\"></i>&nbsp;&nbsp;Download for Chrome");
    },
    setInstalled: function(fromExtension) {
      installed = true;
      $(".btn-install-cta").each(function (index, el) {
        $(el).attr("disabled", "disabled");
      });
      if(fromExtension) $(".btn-install-header").hide();
      setButtons("<i class=\"fa fa-check\"></i>&nbsp;&nbsp;Installed!");
    },
    setInstalling: function() {
      console.log("set installin" + installed);
      setButtons("<i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp;&nbsp;Installing...");
    },
    setError: function() {
      $(".btn-install-cta").each(function (index, el) {
        $(el)
          .attr("disabled", "disabled")
          .removeClass("btn-install-homepage")
          .removeClass("btn-install-header")
          .html("<i class=\"fa fa-exclamation\"></i>&nbsp;&nbsp;Install failed. Refresh to try again.");
      })
    },
    setCustom: function(msg) {
      setButtons(msg);
    },
    setUnsupported: function() {
      this.setCustom("Google Chrome Required");
      //unsupported.show();
    }
  }
})();

//Install the extension
var onClickInstall = function() {
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
}

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
    url: "http://contact.streamkeys.com",
    data: message
  })
    .always(function(jqXHR, textStatus) {
      console.log( "textStatus: ", textStatus );
      console.log( "response: ", jqXHR);
      $("#request-form").hide();
      $("#request-success").show();
      //window.location.href = "sites.html?sentmessage=true";
    });
};

$("#requestModal").on("shown", function() {
  $("#request-form").show();
  $("#request-success").hide();
});

$(function() {

  if(!(window.chrome != null && window.navigator.vendor === "Gogle Inc.")) InstallState.setUnsupported();
  toggleDivs();

  $("#contact_button").click(function() {
    event.preventDefault();
    var data = {
      url: $("#site_url").val(),
      email: $("#email").val(),
      message: $("#comments").val()
    };
    postMessage(data);
  });

  //$.fn.ekkoLightbox.defaults.right_arrow_class = ".fa .fa-arrow-right";
  //$.fn.ekkoLightbox.defaults.left_arrow_class = ".fa .fa-arrow-left";

});
