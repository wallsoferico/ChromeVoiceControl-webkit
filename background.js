/* 
 *
 * The background file that executes all commands
 * 
 */

var actions = {
	"open tab": openTab,
	"open window": openWindow,
	"open new tab": openTab,
	"open new window": openWindow,
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
		var removal_start = this.parseMilliseconds_(this.timeframe_.value);
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
		value = value.replace(/map of /, '');
		value = "http://maps.google.com/maps?q=" + value;
		chrome.tabs.create({
			"url": value
		});
	},
	"get directions from": function (value) {
		var f = value.replace(/get directions from /, '').replace(/to .+/, '');
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
	}
	"translate": function (value) {
		var array = new Array("afrikaans", "af", "albanian", "sq", "arabic", "ar", "belarusian", "be", "bulgarian", "bg", "catalan", "ca", "chinese", "zh", "chinese simplified", "zh-CN", "chinese traditional", "zh-TW", "croation", "hr", "czech", "cs", "danish", "da", "dutch", "nl", "english", "en", "estonian", "et", "filipino", "tl", "finnish", "fi", "french", "fr", "galician", "gl", "german", "de", "greek", "el", "haitian creole", "ht", "hebrew", "iw", "hindi", "hi", "hungarian", "hu", "icelandic", "is", "indonesian", "id", "irish", "ga", "italian", "it", "japanese", "ja", "korean", "ko", "latvian", "lv", "lithuanian", "lt", "macedonian", "mk", "malay", "ms", "maltese", "mt", "norwegian", "no", "persian", "fa", "polish", "pl", "portuguese", "pt", "portuguese portugal", "pt-PT", "romanian", "ro", "russian", "ru", "serbian", "sr", "slovak", "sk", "slovenian", "sl", "spanish", "es", "swahili", "sw", "swedish", "sv", "tagalog", "tl", "thai", "th", "turkish", "tr", "ukrainian", "uk", "vietnamese", "vi", "welsh", "cy", "yiddish", "yi");
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
	"facebook": function() { openTab("www.facebook.com") },
	"google": function() { openTab("www.google.com") },
	"yahoo": function() { openTab("www.yahoo.com") },
	"twitter": function() { openTab("www.twitter.com") },
	"flick": function() { openTab("www.flicker.com"), } 
	"outlook": function() { openTab("www.outlook.com") },
	"dig": function() { openTab("www.digg.com" })
	
};

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
			console.log(commands[value]);
			decide_command(commands[value]);
		}
	});
	decide_command(value);
}

function runCommand(sysCommand, value) {
	actions[sysCommand](value);
}

function decide_command(value) {
	console.log(value);
	var querySuccess = false;
	var sysCommand;
	for(var actionIndex in actions) {
		sysCommand = actions[actionIndex];
		if(!querySuccess && sysCommand && value.indexOf(sysCommand) != -1) {
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