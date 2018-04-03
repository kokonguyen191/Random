const spam = function(element) {
	setTimeout(function() { element.click(); spam(element); }, 50);
}
document.onmousedown = function(event) {
    spam(event.target);
};
