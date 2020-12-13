CurrentStreams = null

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function IsValidURL(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}


function UpdateStreamsList() {
	if (CurrentStreams !== null) {
		$("#StreamText")[0].textContent = CurrentStreams.join(', ')
		$("#watch-button")[0].disabled = '';
	} else {
		$("#StreamText")[0].textContent = 'None'
		$("#watch-button")[0].disabled = 'disabled';
	}
}

function AddStream() {
	if (CurrentStreams === null) CurrentStreams = []

	streamLink = $("#twitch-input")[0].value
	if (streamLink == "" || $.trim(streamLink) == "") {
		return;
	}
	console.log("Adding stream: " + streamLink)

	displayName = streamLink
	if (IsValidURL(streamLink)) {
		console.log("User entered URL...");
		let url = new URL(streamLink)

		// Handle twitch URLs first since they're the easiest to do
		if (url.hostname === 'www.twitch.tv') {
			displayName = url.pathname.substring(1) + "(tw)"
		} else if (url.hostname === 'www.youtube.com') {
			if (!url.searchParams.has('v')) {
				alert('Invalid Youtube Link...');
				return;
			}
			displayName = url.searchParams.get('v') + " (yt)"
		} else {
			// Some sort of unknown link that we can't even handle in the first place
			return;
		}
	} else {
		// They must've entered a name or a youtube ID directly
		displayName = streamLink + " (tw)"
	}

	CurrentStreams.push(displayName)
	UpdateStreamsList()
}

function ClearStreams() {
	CurrentStreams = null;
	UpdateStreamsList()
}

function WatchStreams() {
	var urlParams = new URLSearchParams();

	for (var i = 0; i < CurrentStreams.length; i++) {
		stream = CurrentStreams[i].substring(0, CurrentStreams[i].length - 5)
		platform = CurrentStreams[i].substring(CurrentStreams[i].length - 3, CurrentStreams[i].length - 1)

		console.log("Adding search param for: " + stream + " on: " + platform)
		urlParams.append(platform, stream)
	}

	window.location.href = 'live?' + urlParams.toString() + ($("#switch-box")[0].checked ? "&inv" : "") + ($("#horizontal-box")[0].checked ? "&hor" : "")
}

window.onload = function() {
	$("#twitch-input")[0].addEventListener("keyup", function(evt) {
		if (evt.keyCode === 13) {
			evt.preventDefault();
			$("#add-button")[0].click();
		}
	});

	UpdateStreamsList();
}