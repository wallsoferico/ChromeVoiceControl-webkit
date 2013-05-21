document.getElementsByClassName("tabmenu")[0].addEventListener('click', function (e) {
	e = e || window.event;
	if(e.target.parentNode.parentNode.className == "tabmenu") {
		document.getElementsByClassName("active")[0].className = "";
		document.getElementById(e.target.parentNode.id + "Content").className = "active";
	}
}, false);

var hash = window.location.hash;
if(hash == "")
	hash = "#websites";
document.getElementById(hash.substr(1) + "Content").className = "active";

document.getElementById("sync").addEventListener("click", function () {
	chrome.storage.local.set({'sync': true});
});
document.getElementById("local").addEventListener("click", function () {
	chrome.storage.local.set({'sync': false});
});

chrome.storage.local.get('sync', function (i) {
	if(i.sync == true)
		document.getElementById("sync").checked = true;
	else
		document.getElementById("local").checked = true;
});
