/* 
 *
 * The background file that executes all commands
 * 
 */

var array = new Array("afrikaans", "af", "albanian", "sq", "arabic", "ar", "belarusian", "be", "bulgarian", "bg", "catalan", "ca", "chinese", "zh", "chinese simplified", "zh-CN", "chinese traditional", "zh-TW", "croation", "hr", "czech", "cs", "danish", "da", "dutch", "nl", "english", "en", "estonian", "et", "filipino", "tl", "finnish", "fi", "french", "fr", "galician", "gl", "german", "de", "greek", "el", "haitian creole", "ht", "hebrew", "iw", "hindi", "hi", "hungarian", "hu", "icelandic", "is", "indonesian", "id", "irish", "ga", "italian", "it", "japanese", "ja", "korean", "ko", "latvian", "lv", "lithuanian", "lt", "macedonian", "mk", "malay", "ms", "maltese", "mt", "norwegian", "no", "persian", "fa", "polish", "pl", "portuguese", "pt", "portuguese portugal", "pt-PT", "romanian", "ro", "russian", "ru", "serbian", "sr", "slovak", "sk", "slovenian", "sl", "spanish", "es", "swahili", "sw", "swedish", "sv", "tagalog", "tl", "thai", "th", "turkish", "tr", "ukrainian", "uk", "vietnamese", "vi", "welsh", "cy", "yiddish", "yi");
 
var actions = {
	"open tab": function() { openTab() },
	"open window": function() { openWindow() },
	"open new tab": function () { openTab() },
	"open new window": function() { openWindow() },
	"open incognito window": function () {
		chrome.windows.create({
			"incognito": true
		});
	},
	"open website in new tab": function (value) {
		value = value.replace(/.+ tab /, '');
		openTab(value);
	},
	"open website in new window": function (value) {
		value = value.replace(/.+ window /, '');
		
		if (value.indexOf("http://") < 0) 
			value = "http://" + value;
		
		chrome.windows.create({
			"url": value
		});
	},
	"open tab in new window": function () {
		chrome.windows.getLastFocused(function(w) {
			chrome.tabs.getSelected(w.id, function(t) {
				chrome.windows.create({
					"tabId": t.id
				});
			});
		});
	},
	"open options": function() { openTab("chrome://settings/browser") },
	"open settings": function() { openTab("chrome://settings/browser") },
	"edit settings": function() { openTab("chrome://settings/browser") },
	"open history": function() { openTab("chrome://history/") },
	"delete history": function () {
		chrome.history.deleteAll(function() {});
	},
	"search": function (value) {
		value = value.replace(/search /, '');
		openTab("http://google.com/search?as_q=" + value);
	},
	"manage extension": function() { openTab("chrome://extensions/") },
	"clear browsing data": function () {
		if(confirm("Are you sure you wish to delete your browsing data?")) {
			var d = new Date();
			var removal_start = d.getMilliseconds();
			if (removal_start !== undefined) {
				chrome.browsingData.remove({ "since" : removal_start }, {
					"appcache": true,
					"cache": true,
					"cookies": true,
					"downloads": true,
					"fileSystems": true,
					"formData": true,
					"history": true,
					"indexedDB": true,
					"localStorage": true,
					"serverBoundCertificates": true,
					"pluginData": true,
					"passwords": true,
					"webSQL": true
				});
			}
		}
	},
	"close tab": function() {
		chrome.windows.getLastFocused(function(w) {
			chrome.tabs.getSelected(w.id, function(t) {
				chrome.tabs.remove(t.id);
			});
		});
	},
	"close window": function() {
		chrome.windows.getLastFocused(function(w) {
			chrome.windows.remove(w.id);
		});
	},
	"map of": function (value) {
		console.log(value);
		value = value.replace(/map of|map of /g, '');
		console.log(value);
		value = "http://maps.google.com/maps?q=" + value;
		chrome.tabs.create({
			"url": value
		});
	},
	"directions from": function (value) {
		var f = value.replace(/directions from /, '').replace(/to .+/, '');
		var t = value.replace(/.+ to /, '');
		var url = "http://maps.google.com/?saddr=" + f + "&daddr=" + t;
		chrome.tabs.create({
			"url": url
		});
	},
	"store tab": function () {
		chrome.windows.getLastFocused(function(w) {
			chrome.tabs.getSelected(w.id, function(t) {
				chrome.tabs.update(t.id, {
					"pinned": true
				});
			});
		});
	},
	"remove stored tab": function () {
		chrome.windows.getLastFocused(function(w) {
			chrome.tabs.getSelected(w.id, function(t) {
				chrome.tabs.update(t.id, {
					"pinned": false
				});
			});
		});
	},
	"translate": function (value) {
		value = value.replace(/translate /, '');
		lang = value.replace(/.+ to /, '');
		value = value.replace(/ to .+/, '');
		for (var a = 0; a < array.length; a += 2) {
			if (array[a] == lang) {
				value = "http://translate.google.com/#auto|" + array[a + 1] + "|" + value;
				chrome.tabs.create({
					"url": value
				});
			}
		}
	},
	"create new document": function() { createDocs("document") },
	"create document": function() { createDocs("document") },
	"create new presentation": function() { createDocs("presentation") },
	"create presentation": function() { createDocs("presentation") },
	"create new spreadsheet": function() { createDocs("spreadsheet") },
	"create spreadsheet": function() { createDocs("spreadsheet") },
	"facebook": function() { openTab("http://www.facebook.com") },
	"google": function() { openTab("http://www.google.com") },
	"yahoo": function() { openTab("http://www.yahoo.com") },
	"twitter": function() { openTab("http://www.twitter.com") },
	"flick": function() { openTab("http://www.flicker.com") },  
	"outlook": function() { openTab("http://www.outlook.com") },
	"dig": function() { openTab("http://www.digg.com") }
	
};

function levenshtein (s1, s2) {
  // http://kevin.vanzonneveld.net
  // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // +            bugfixed by: Onno Marsman
  // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // + reimplemented by: Brett Zamir (http://brett-zamir.me)
  // + reimplemented by: Alexander M Beedie
  // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
  // *                returns 1: 3
  if (s1 == s2) {
    return 0;
  }

  var s1_len = s1.length;
  var s2_len = s2.length;
  if (s1_len === 0) {
    return s2_len;
  }
  if (s2_len === 0) {
    return s1_len;
  }

  // BEGIN STATIC
  var split = false;
  try {
    split = !('0')[0];
  } catch (e) {
    split = true; // Earlier IE may not support access by string index
  }
  // END STATIC
  if (split) {
    s1 = s1.split('');
    s2 = s2.split('');
  }

  var v0 = new Array(s1_len + 1);
  var v1 = new Array(s1_len + 1);

  var s1_idx = 0,
    s2_idx = 0,
    cost = 0;
  for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
    v0[s1_idx] = s1_idx;
  }
  var char_s1 = '',
    char_s2 = '';
  for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
    v1[0] = s2_idx;
    char_s2 = s2[s2_idx - 1];

    for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
      char_s1 = s1[s1_idx];
      cost = (char_s1 == char_s2) ? 0 : 1;
      var m_min = v0[s1_idx + 1] + 1;
      var b = v1[s1_idx] + 1;
      var c = v0[s1_idx] + cost;
      if (b < m_min) {
        m_min = b;
      }
      if (c < m_min) {
        m_min = c;
      }
      v1[s1_idx + 1] = m_min;
    }
    var v_tmp = v0;
    v0 = v1;
    v1 = v_tmp;
  }
  return v0[s1_len];
}

var storage = chrome.storage.local;

chrome.storage.local.get('sync', function (i) { 
	if(i.sync == true)
		storage = chrome.storage.sync;
});
 
chrome.runtime.onMessage.addListener(
	function(request, sender, onChange) {
		checkCustomCommands(request.command);
		
});

function openTab(value) {
	if(value === undefined)
		chrome.tabs.create({});
	else
		chrome.tabs.create({ url: value });
}
function openWindow() {
	chrome.windows.create();
}

function createDocs(type) {
	openTab("https://docs.google.com/" + type);
}

function checkCustomCommands(value) {
	storage.get(value, function (commands) {
		if(commands[value] !== undefined) {
			//console.log(commands[value]);
			decide_command(commands[value]);
		}
	});
	decide_command(value);
}

function runCommand(sysCommand, value) {
	actions[sysCommand](value);
	return true;
}

function decide_command(value) {
	//console.log(value);
	var querySuccess = false;
	var sysCommand;
	var temp;
	for(var actionIndex in actions) {
		sysCommand = actionIndex;
		temp = value.substr(0, sysCommand.length);
		if(levenshtein(temp, sysCommand) < 5) {
			//console.log(temp + " " + levenshtein(temp, sysCommand) + " command = " + sysCommand);
			value = sysCommand + value.substr(sysCommand.length);
			//console.log("new value: " + value);
		}
		if(!querySuccess && sysCommand && value.indexOf(sysCommand) != -1) {
			console.log("success");
			querySuccess = runCommand(sysCommand, value);
		}
	}
}
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "http://voicecontrol.weebly.com/credits.html"});
}
install_notice();