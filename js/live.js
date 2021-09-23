availablePlayers = ["tw", "yt"];

Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
};

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
};

function CalculateScreenPercentages(queryStr) {
  screenSplit = 0;
  for (const [key, value] of queryStr) {
    if (availablePlayers.indexOf(key) > -1) {
      channels = value.split(",");
      screenSplit += channels.length;
    }
  }
  return (1 / screenSplit) * 100 + "%";
}

function SwitchToHorizontal(queryStr) {
  players = $(".player");
  chats = $(".chat");
  for (var i = 0; i < chats.length; i++) {
    if (!queryStr.has("inv")) {
      chats[i].appendAfter(players[i]);
    } else {
      chats[i].appendBefore(players[i]);
    }

    chats[i].style.width = players[i].style.width = "50%";
    chats[i].style.height = players[i].style.height =
      CalculateScreenPercentages(queryStr);
  }

  $("#players")[0].style.height = "100%";
}

function InitializeTwitchEmbeds(twitchChannel, queryStr) {
  var videoFrame = document.createElement("iframe");
  videoFrame.src =
    "https://player.twitch.tv/?channel=" +
    twitchChannel +
    "&parent=fromdarkhell.github.io&parent=fdh.one&parent=simulstream.test&muted=true";

  var chatFrame = document.createElement("iframe");
  chatFrame.src =
    "https://www.twitch.tv/embed/" +
    twitchChannel +
    "/chat?darkpopout&parent=fromdarkhell.github.io&parent=fdh.one&parent=simulstream.test";
  chatFrame.frameBorder = videoFrame.frameBorder = "0";

  videoFrame.setAttribute("allowFullScreen", "");
  videoFrame.style.width = chatFrame.style.width =
    CalculateScreenPercentages(queryStr);
  videoFrame.classList.add("twPlayer", "player");
  chatFrame.classList.add("twChat", "chat");

  return [videoFrame, chatFrame];
}

function InitializeYoutubeEmbeds(ytID, queryStr) {
  var videoFrame = document.createElement("iframe");
  videoFrame.src = "https://www.youtube.com/embed/" + ytID;
  videoFrame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  videoFrame.setAttribute("allowFullScreen", "");

  var chatFrame = document.createElement("iframe");
  chatFrame.src =
    "https://www.youtube.com/live_chat?v=" +
    ytID +
    "&embed_domain=fromdarkhell.github.io";
  chatFrame.frameBorder = videoFrame.frameBorder = "0";

  videoFrame.style.width = CalculateScreenPercentages(queryStr);
  chatFrame.style.width = CalculateScreenPercentages(queryStr);
  chatFrame.classList.add("ytChat", "chat");
  videoFrame.classList.add("ytPlayer", "player");

  return [videoFrame, chatFrame];
}

function ParseChannelOptions() {
  const queryStr = new URLSearchParams(window.location.search);
  console.log("Parsing channel options: " + window.location.search);
  splitPercentage = CalculateScreenPercentages(queryStr);
  console.log("Screen divided by: " + splitPercentage);

  for (const [key, value] of queryStr) {
    if (key == "tw") {
      // If we have a (set) of twitch channels in the list
      twitchChannels = value.split(",");
      for (var i = 0; i < twitchChannels.length; i++) {
        twitchChannel = twitchChannels[i];
        console.log("Adding Twitch embed for: " + twitchChannel);

        const [videoFrame, chatFrame] = InitializeTwitchEmbeds(
          twitchChannel,
          queryStr
        );

        $("#players")[0].appendChild(videoFrame);
        $("#chats")[0].appendChild(chatFrame);
      }
    } else if (key == "yt") {
      youtubeStreams = value.split(",");
      for (var i = 0; i < youtubeStreams.length; i++) {
        ytID = youtubeStreams[i];
        console.log("Adding Youtube embed for: " + ytID);

        const [videoFrame, chatFrame] = InitializeYoutubeEmbeds(ytID, queryStr);

        $("#players")[0].appendChild(videoFrame);
        $("#chats")[0].appendChild(chatFrame);
      }
    }
  }

  if (!queryStr.has("yt") && !queryStr.has("tw")) {
    window.location.search = "";
    document.location.pathname = document.location.pathname.substr(
      0,
      document.location.pathname.lastIndexOf("/")
    );
  }

  $("#players")[0].style.width = $("#chats")[0].style.width = "100%";
}

window.onload = function () {
  pageHeight = Math.max($(document).height(), $(window).height());
  ParseChannelOptions();

  const queryStr = new URLSearchParams(window.location.search);

  if (queryStr.has("inv") && !queryStr.has("hor")) {
    $("#players").insertAfter("#chats"); // Reordering the divs flips them when in vertical
  }

  if (queryStr.has("hor")) {
    console.log("Switching to horizontal mode...");
    // Handle a horizontal layout instead
    SwitchToHorizontal(queryStr);
  }
};
