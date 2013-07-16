document.addEventListener("keydown", keydown, false);

var recognition = new webkitSpeechRecognition();

function passMessage(text) {
	//chrome.extension.sendMessage("fboiibgbjljogjkebjcfhggbiponmpkk", {
	chrome.runtime.sendMessage( {
		command: text
	}, function(response) {
		console.log("worked");
		window.recognition.stop();
	});
}

var style = document.createElement("style");
style.innerHTML = "#toast{ z-index: 9999; position: fixed; top: 20px; left: 50%; width: 200px; margin-left: -100px; border: 1px solid #666; background-color: #B1BCCF; padding: 10px 0 ; text-align:center; opacity: 0; -webkit-transition: opacity 1s ease-out; transition: opacity 1s ease-out;}";
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
	window.recognition.stop();
}

function keydown(e) {
	e = window.event || e;
	if (e.keyCode == '90' && e.ctrlKey && e.altKey) {
		if (('webkitSpeechRecognition' in window)) {
			
			//recognition.continuous = true;
			window.recognition.interimResults = true;
			window.recognition.onstart = function() {
				showToast();
				recognizing = true;
				setTimeout(hideToast, 10000);
			};
			window.recognition.start();
			ignore_onend = false;
			window.recognition.onend = function() {
				hideToast();
				recognizing = false;
				if (ignore_onend) {
					return;
				}
			};
			window.recognition.onresult = function(event) {
				hideToast();
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						console.log("Last message: " + event.results[i][0].transcript);
						passMessage(event.results[i][0].transcript);
						window.recognition.stop();
					} else {
						console.log(event.results[i][0].transcript);
					}
				}
				
			};
		}
	}
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

//start_button.style.display = 'inline-block';
window.recognition = new webkitSpeechRecognition();
window.recognition.continuous = true;
window.recognition.interimResults = true;

window.recognition.onstart = function() {
	recognizing = true;
};

window.recognition.onerror = function(event) {
	if (event.error == 'no-speech') {
		ignore_onend = true;
	}
	if (event.error == 'audio-capture') {
		ignore_onend = true;
	}
	if (event.error == 'not-allowed') {
		ignore_onend = true;
	}
};

window.recognition.onend = function() {
	recognizing = false;
	if (ignore_onend) {
		return;
	}
	if (!final_transcript) {
		return;
	}
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  window.recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      window.recognition.onend = null;
      window.recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };