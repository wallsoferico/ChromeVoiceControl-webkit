var aComp;
var wComp;

var obj = {};
var storage = chrome.storage.local;

chrome.storage.local.get('sync', function (i) { 
	if(i.sync == true)
		storage = chrome.storage.sync;
});
printCommands();

document.getElementById("submitCommand").addEventListener('click', submitCustCommand);
document.getElementById("clearCommands").addEventListener('click', clearCommands);
document.getElementById("testbutton").addEventListener('click', checkCustomCommands);

document.getElementById("custCommands").addEventListener('click', function (e) { 
	if(e.target.id !== undefined && e.target.id !== "") 
		deleteCustCommand(e.target.id); 
});

function checkCustomCommands() {
	var value = document.getElementById('testbox').value;
	storage.get(value, function (commands) {
		if(commands[value] !== undefined) {
			console.log(commands[value]);
			decide_command(commands[value]);
		}
	});
	
}

function deleteAlerts() {
	var alert = document.getElementsByClassName("alert")[0];
	if(alert !== undefined)
		alert.parentNode.removeChild(alert);
}

function createAlert(msg) {
	deleteAlerts();
	var alert = document.createElement("div");
	alert.innerHTML = msg;
	alert.className = "alert";
	
	var x = document.createElement("button");
	x.className = "close";
	x.innerHTML = "&times;";
	
	alert.appendChild(x);
	
	x.addEventListener("click", deleteAlerts);
	
	var parent = document.getElementsByClassName("commands")[3];
	parent.insertBefore(alert, parent.firstChild);
	
	return alert;
}

function addToList(key, site) {
	var list = document.getElementById("custCommands");
	var li = document.createElement("li");
	li.innerHTML = key + " : " + site;
	var b = document.createElement("button");
	b.className = "close";
	b.id = key;
	b.innerHTML = "&times;";
	li.appendChild(b);
	
	list.appendChild(li);
}
								
function submitCustCommand() {
	deleteAlerts();
	var website = document.getElementById('commandBox').value;
	var alias = document.getElementById('aliasBox').value;
	
	obj[alias] = website;
	
	if(website == '' || obj[alias] == '') {
		createAlert("Please fill in all boxes");
		return -1;
	}
	
	if(website.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) {
		if(website.indexOf('http://') < 0)
			website = "http://" + website;
	}
		
	storage.get(alias, function (commands) {
		if(commands[alias] === undefined) {
			storage.set(obj);
			addToList(alias, website);
			document.getElementById('commandBox').value = "";
			alias = document.getElementById('aliasBox').value = "";
		}
		else
			createAlert("Alias already exists as: " + alias + " for website " + commands[alias]);
	});
}

function printCommands() {
	var list = document.getElementById("custCommands");
	
	var li = document.createElement("li");
	li.innerHTML = "Alias : Website";
	list.appendChild(li);
	
	storage.get(null, function (commands) {
		
		for(key in commands) {
			addToList(key, commands[key]);
		}
	});
}

function deleteCustCommand(id) {
	storage.remove(id);
	document.location.reload(true);
}

function clearCommands() {
	storage.clear();
	document.location.reload(true);
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});
