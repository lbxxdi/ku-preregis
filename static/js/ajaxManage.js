var ajaxCount=0;

var loadingStart = function() {
	console.log("loading-start");
	$('.main-loading').show();
}

var loadingComplete = function() {
	console.log("loading-complete");
	$('.main-loading').hide();
}

jQuery.ajaxSetup({async:false});

$( document ).ajaxStart(function() {
    $('.main-loading').show();
    ajaxCount += 1;

    console.log("ajaxStart");
});


$( document ).ajaxComplete(function() {
    ajaxCount -= 1;

    if (ajaxCount == 0) {
        $('.main-loading').hide();
    }
});



window.ajaxCount = ajaxCount;
window.loadingStart = loadingStart;
window.loadingComplete = loadingComplete;