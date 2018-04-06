var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

var replace = function () {
	delay(function(){
		// do stuff
	document.getElementsByClassName("_3szn _3szo")[3].click()
		delay(function(){
			// do stuff
		document.getElementsByClassName("_1uw-")[7].click()
			delay(function(){
				// do stuff
			document.getElementsByClassName("_1lih _1ift _1ifu img")[35].click()
			}, 400 + Math.random(600) );
		}, 400 + Math.random(600) );
	}, 400 + Math.random(600) );
}

setInterval(replace, 10000);
