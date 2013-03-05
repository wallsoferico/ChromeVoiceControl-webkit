document.addEventListener("keydown", keydown, false);

function passMessage(text) {
	chrome.extension.sendMessage("fboiibgbjljogjkebjcfhggbiponmpkk", {
		command: text
	}, function(response) {
		console.log("worked");
	});
}
var style = document.createElement("style");
style.innerHTML = "#toast{ position: fixed; top: 20px; left: 50%; width: 200px; margin-left: -100px; border: 1px solid #666; background-color: #B1BCCF; padding: 10px 0 ; text-align:center; opacity: 0; -webkit-transition: opacity 1s ease-out; transition: opacity 1s ease-out;}";
document.body.appendChild(style);
var div = document.createElement('div');
		div.id = "toast";
		div.innerHTML = "Voice Recognition Started";
		document.body.appendChild(div);
		
function showToast() {
	var alert = document.getElementById("toast");
	alert.style.opacity = 0.9;
}
function hideToast(){
	var alert = document.getElementById("toast");
	alert.style.opacity = 0;
}

function keydown(e) {
	e = window.event || e;
	if (e.keyCode == '90' && e.ctrlKey && e.altKey) {
		showToast();
		if (('webkitSpeechRecognition' in window)) {
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.onstart = function() {
				recognizing = true;
			};
			recognition.start();
			ignore_onend = false;
			recognition.onend = function() {
				hideToast();
				recognizing = false;
				if (ignore_onend) {
					return;
				}
			};
			recognition.onresult = function(event) {
				hideToast();
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						console.log("Last message: " + event.results[i][0].transcript);
						passMessage(event.results[i][0].transcript);
					} else {
						console.log(event.results[i][0].transcript);
					}
				}
				recognition.stop();
			};
		}
	}
}