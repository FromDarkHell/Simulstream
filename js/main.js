function CalculateScreenPercentages(queryStr) {
	screenSplit = 0;
	if (queryStr.has('yt')) {
		screenSplit += (queryStr.get("yt").split(",").length)
	}
	if (queryStr.has('tw')) {
		screenSplit += (queryStr.get("tw").split(",").length)
	}

	return ((1 / screenSplit * 100)) + "%"
}

function InitializeTwitchEmbeds(twitchChannel, queryStr) {
	var videoFrame = document.createElement('iframe');
	videoFrame.src = "https://player.twitch.tv/?channel=" + twitchChannel + "&parent=fromdarkhell.github.io&parent=simulstream.test&muted=true"

	var chatFrame = document.createElement('iframe')
	chatFrame.src = "https://www.twitch.tv/embed/" + twitchChannel + "/chat?darkpopout&parent=fromdarkhell.github.io&parent=simulstream.test"
	chatFrame.frameBorder = videoFrame.frameBorder = "0";

	videoFrame.setAttribute('allowFullScreen', '')
	videoFrame.style.width = chatFrame.style.width = CalculateScreenPercentages(queryStr)
	videoFrame.classList.add('twPlayer', 'player')
	chatFrame.classList.add('twChat', 'chat')

	return [videoFrame, chatFrame]
}

function InitializeYoutubeEmbeds(ytID, queryStr) {
	var videoFrame = document.createElement('iframe');
	videoFrame.src = "https://www.youtube.com/embed/" + ytID
	videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	videoFrame.setAttribute('allowFullScreen', '')

	var chatFrame = document.createElement('iframe');
	chatFrame.src = "https://www.youtube.com/live_chat?v=" + ytID + "&embed_domain=fromdarkhell.github.io"
	chatFrame.frameBorder = videoFrame.frameBorder = "0";

	videoFrame.style.width = CalculateScreenPercentages(queryStr)
	chatFrame.style.width = CalculateScreenPercentages(queryStr)
	chatFrame.classList.add('ytChat', 'chat')
	videoFrame.classList.add('ytPlayer', 'player')

	return [videoFrame, chatFrame]
}

function ParseChannelOptions() {
	const queryStr = new URLSearchParams(window.location.search);
	console.log("Parsing channel options: " + window.location.search)
	splitPercentage = CalculateScreenPercentages(queryStr);
	console.log("Screen divided by: " + splitPercentage)

	if (queryStr.has('tw')) { // If we have a (set) of twitch channels in the list
		twitchChannels = queryStr.get("tw").split(",")
		console.log("Twitch Channels: " + twitchChannels)
		for (var i = 0; i < twitchChannels.length; i++) {
			twitchChannel = twitchChannels[i];
			console.log("Adding embed for: " + twitchChannel)

			const [videoFrame, chatFrame] = InitializeTwitchEmbeds(twitchChannel, queryStr)

			document.getElementById('players').appendChild(videoFrame)
			document.getElementById('chats').appendChild(chatFrame)
		}
	}


	if (queryStr.has('yt')) {
		youtubeStreams = queryStr.get("yt").split(",")
		for (var i = 0; i < youtubeStreams.length; i++) {
			ytID = youtubeStreams[i];
			console.log("Adding Youtube embed for: " + ytID)

			const [videoFrame, chatFrame] = InitializeYoutubeEmbeds(ytID, queryStr)

			document.getElementById('players').appendChild(videoFrame)
			document.getElementById('chats').appendChild(chatFrame)
		}
	}

	document.getElementById('players').style.width = document.getElementById('chats').style.width = "100%"
}

window.onload = function() {
	pageHeight = Math.max($(document).height(), $(window).height())
	ParseChannelOptions();
}