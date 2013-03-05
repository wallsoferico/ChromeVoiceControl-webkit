//tabview_initialize('TabView');	
var array = [".home", ".website", ".maps", ".browser", ".credits" ];

function hideOthers() {
	var i = 0;
	$.each(array, function () {
		console.log(array[i]);
		$(array[i]).css("display", "none");
		i++;
	});
}
$("#home").click(function () {
	hideOthers();
	$(".home").css("display", "block");
});
$("#website").click(function () {
	hideOthers();
	$(".website").css("display", "block");
});
$("#map").click(function () {
	hideOthers();
	$(".map").css("display", "block");
});
$("#browser").click(function () {
	hideOthers();
	$(".browser").css("display", "block");
});
$("#credits").click(function () {
	hideOthers();
	$(".credits").css("display", "block");
});