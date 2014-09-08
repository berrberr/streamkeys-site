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
      $(".btn-install-header").show();
    },
    setInstalled: function(fromExtension) {
      installed = true;
      disableButtons();
      if(fromExtension) $(".btn-install-header").hide();
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
  if(!docCookies.hasItem("sk-installed")) {
    if(!(window.chrome != null && window.navigator.vendor === "Google Inc.")) InstallState.setUnsupported();
    else InstallState.setDefault();
  } else {
    console.log("Cookie found, installed.");
    InstallState.setInstalled();
  }
};

//Message from extension means that it is installed, set the cookie
document.addEventListener("streamkeys-installed", function(e) {
  InstallState.setInstalled(true);
  docCookies.setItem("sk-installed", e.detail);
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

$("#requestModal").on("shown", function() {
  $("#request-form").show();
  $("#request-success").hide();
});

$(function() {

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

//Mozilla cookies
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

checkInstalled();
