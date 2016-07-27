var loadingStart = function() {
	console.log("loading-start");
	$('.main-loading').show();
}

var loadingComplete = function() {
	console.log("loading-complete");
	$('.main-loading').hide();
}

//jQuery.ajaxSetup({async:false});

window.loadingStart = loadingStart;
window.loadingComplete = loadingComplete;